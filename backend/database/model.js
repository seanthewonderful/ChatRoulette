import { DataTypes, Model } from "sequelize";
import connectToDB from "./db.js";
import util from "util";
import bcryptjs from "bcryptjs";

export const db = await connectToDB("postgresql:///chat_roulette");

export class User extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}
User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // email: {
    //   type: DataTypes.STRING,
    //   unique: true,
    //   allowNull: false,
    // },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcryptjs.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.password) {
          user.password = await bcryptjs.hash(user.password, 10);
        }
      },
    },
    defaultScope: {
      attributes: {
        exclude: ["password"],
      },
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ["password"],
        },
      },
    },
    modelName: "user",
    sequelize: db,
  }
)

export class Message extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}
Message.init(
  {
    messageId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    modelName: "message",
    sequelize: db,  
  }
)

export class Room extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}
Room.init(
  {
    roomId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    modelName: "room",
    sequelize: db,
  }
)

User.hasMany(Message, { foreignKey: "userId", as: "messages" });
Message.belongsTo(User, { foreignKey: "userId", as: "senderId" });

User.hasMany(Room, { foreignKey: "userId", as: "rooms" });
Room.belongsTo(User, { foreignKey: "userId", as: "hostId" });

Room.hasMany(Message, { foreignKey: "roomId", as: "messages" });
Message.belongsTo(Room, { foreignKey: "roomId" });