const Sequelize = require('sequelize');

module.exports = sequelize.define('Post', {
  id: {
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  md5: {
    type: Sequelize.TEXT,
  },
  file_ext: {
    type: Sequelize.TEXT,
  },
  tag_string: {
    type: Sequelize.TEXT,
  },
  tag_count_general: {
    type: Sequelize.INTEGER,
  },
}, { timestamps: false });
