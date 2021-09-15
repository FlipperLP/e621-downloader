module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  },
};
