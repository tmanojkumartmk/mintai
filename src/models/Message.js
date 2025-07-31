'use strict';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    chatroomId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'chatroom_id'
    },
    userMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'user_message'
    },
    geminiResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'gemini_response'
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    }
  }, {
    tableName: 'messages',
    timestamps: false
  });

  Message.associate = function(models) {
    Message.belongsTo(models.Chatroom, {
      foreignKey: 'chatroomId',
      as: 'chatroom'
    });
  };

  return Message;
};
