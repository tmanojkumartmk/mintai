'use strict';

module.exports = (sequelize, DataTypes) => {
  const Chatroom = sequelize.define('Chatroom', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255]
      }
    }
  }, {
    tableName: 'chatrooms',
    underscored: true,
    updatedAt: false
  });

  Chatroom.associate = function(models) {
    Chatroom.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'creator'
    });
    Chatroom.hasMany(models.Message, {
      foreignKey: 'chatroomId',
      as: 'messages'
    });
  };

  return Chatroom;
};
