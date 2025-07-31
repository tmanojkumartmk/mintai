'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      chatroom_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'chatrooms',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      user_message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      gemini_response: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('messages', ['chatroom_id', 'timestamp']);
  },

  async down (queryInterface) {
    await queryInterface.dropTable('messages');
  }
};
