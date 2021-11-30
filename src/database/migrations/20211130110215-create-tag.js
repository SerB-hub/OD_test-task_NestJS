'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tags', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      creatorUid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uid'
        }
      },
      name: {
        type: Sequelize.STRING(40),
        unique: true,
        allowNull: false
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      },
    });
  },
  // @BelongsTo(() => User)
  //   creator: User;
  //
  // @HasMany(() => UserTag)
  //   userTags: UserTag[]


  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tags');

  }
};
