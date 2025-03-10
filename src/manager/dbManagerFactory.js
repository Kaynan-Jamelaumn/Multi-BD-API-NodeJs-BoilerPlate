import { MongoDBManager } from "./MongoDBManager.js";
import { MySQLManager } from "./MysqlManager.js";

export const getDBManager = (model) => {
  switch (process.env.DB_TYPE) {
    case "mongo": return new MongoDBManager(model);
    case "mysql": return new MySQLManager(model);
    default: throw new Error("Invalid DB_TYPE");
  }
};