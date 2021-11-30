'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
          uid: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            unique: true,
            primaryKey: true
          },
          email: {
            type: Sequelize.STRING(100),
            unique: true,
            allowNull: false
          },
          password: {
            type: Sequelize.STRING(100),
            allowNull: false
          },
          nickname: {
            type: Sequelize.STRING(30),
            unique: true,
            allowNull: false
          },
    });
          //   @HasMany(() => UserTag)
          //   tags: UserTag[];
          //
          //   @HasMany(() => Tag)
          //   createdTags: Tag[];
          // }

  },

  down: async (queryInterface, Sequelize) => {
     return queryInterface.dropTable('users');

  }
};
