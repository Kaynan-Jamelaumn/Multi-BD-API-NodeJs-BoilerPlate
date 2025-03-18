import { Sequelize } from 'sequelize';
import { MysqlModelStatic } from '../../../types/models';
declare const UserMysql: (sequelize: Sequelize) => MysqlModelStatic;
export default UserMysql;
