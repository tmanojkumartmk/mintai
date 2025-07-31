'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserMessageCount = sequelize.define('UserMessageCount', {
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
    messageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'message_count'
    },
    lastReset: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'last_reset'
    }
  }, {
    tableName: 'user_message_counts',
    timestamps: false
  });

  UserMessageCount.associate = function(models) {
    UserMessageCount.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return UserMessageCount;
};
