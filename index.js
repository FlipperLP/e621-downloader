const got = require('got');

const { createWriteStream, existsSync, mkdirSync } = require('fs');

const Sequelize = require('sequelize');

const errHandler = (err) => console.error('ERROR:', err);

const rootDir = './out/';

// open DB
const sequelize = new Sequelize('posts', null, null, {
  dialect: 'sqlite',
  storage: `${rootDir}posts.sqlite`,
  logging: false,
  transactionType: 'IMMEDIATE',
  retry: {
    max: 20,
  },
});

global.sequelize = sequelize;

const Post = require('./models/Post');

const endpoint = got.extend({
  prefixUrl: 'https://e621.net',
  responseType: 'json',
  headers: {
    'user-agent': 'Phil | Flipper#3621 downloading e621 for mashine learing',
  },
});

// create folder
async function createDir(md5) {
  const completeDir = `${rootDir}images/${md5.slice(0, 2)}`;
  if (!existsSync(completeDir)) mkdirSync(completeDir, { recursive: true });
  return completeDir;
}

function createEntry(id, md5, file_ext, tag_string, tag_count_general) {
  Post.findOrCreate({
    where: { id },
    defaults: {
      md5, file_ext, tag_string, tag_count_general,
    },
  }).catch(errHandler);
}

// get pictures
async function getPics(page) {
  const { body } = await endpoint('posts.json', {
    searchParams: {
      tags: 'id:>=9000 order:id_asc -status:deleted', page, limit: 1000, login: 'Flipper', api_key: 'xTX3rSxE2A7tVUDDWaGYDWSB',
    },
  });
  return body.posts;
}

async function downloadFile(url, md5, ext) {
  got.stream(url).pipe(createWriteStream(`${await createDir(md5)}/${md5}.${ext}`));
}

//
//
// MAINCODE
//
//

(async () => {
  // setup tables
  console.log('[DB] Syncing tables...');
  await sequelize.sync();
  await console.log('[DB] Done syncing!');

  // cyceling 50 pages
  for (let i = 0; i < 10; i++) {
    setTimeout(async () => {
      const posts = await getPics(i);
      posts.forEach((post) => {
        const tags = post.tags.general.join(' ');
        const md5 = post.file.md5;
        const ext = post.file.ext;
        const url = post.sample.url || post.file.url;
        if (url) {
          createEntry(post.id, md5, ext, tags, tags.length);
          downloadFile(url, md5, ext);
        } else console.warn('No URL present, skipping.');
      });
    }, 20000 * i);
  }
})();
