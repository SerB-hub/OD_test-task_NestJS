'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_tags', {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      userUid: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'uid'
        }
      },
      tagId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },
  // @BelongsTo(() => Tag)
  // tag: Tag;
  //
  // @BelongsTo(() => User)
  // user: User


  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_tags');

  }
};
