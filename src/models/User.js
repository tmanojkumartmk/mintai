'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^\+?[\d\s-]+$/
      },
      field: 'phone_number'
    },
    subscriptionTier: {
      type: DataTypes.ENUM('basic', 'pro'),
      defaultValue: 'basic',
      allowNull: false,
      field: 'subscription_tier'
    }
  }, {
    tableName: 'users',
    underscored: true
  });

  User.associate = function(models) {
    User.hasMany(models.Chatroom, {
      foreignKey: 'userId',
      as: 'chatrooms'
    });
  };

  return User;
};
