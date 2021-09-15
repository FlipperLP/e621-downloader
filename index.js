const got = require('got');

const endpoint = got.extend({
  prefixUrl: 'https://e621.net',
  responseType: 'json',
  headers: {
    'user-agent': 'Flipper testing',
  },
});

(async () => {
  const { body } = await endpoint('posts.json', { searchParams: { tags: 'id:>=90 order:id_asc', page: 1, limit: 1000 } });
  console.log(body);
})();
