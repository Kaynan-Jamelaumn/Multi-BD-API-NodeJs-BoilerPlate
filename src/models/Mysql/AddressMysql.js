import { DataTypes } from "sequelize";

const AddressMysql = (sequelize) => {
  const Address =sequelize.define<MysqlModel>(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Table name in the database
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      complement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Brazil", // Default country
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      hooks: {
        beforeUpdate: (address) => {
          address.updatedAt = new Date(); // Ensure updatedAt is always updated
        },
      },
    }
  );

  return Address;
};

export default AddressMysql;