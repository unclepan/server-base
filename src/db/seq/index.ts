/**
 * @description 配置sequelize ，连接 mysql
 */
import sequelize from 'sequelize';
import config from '../../config';
const { Sequelize } = sequelize;
const { mysqlConf } = config;

// 连接配置
const { database, user, password, host, port } = mysqlConf;
const conf: sequelize.Options = {
	host,
	port,
	dialect: 'mysql'
};
// 线上环境用 链接池
if (process.env.NODE_ENV === 'production') {
	conf.pool = {
		max: 5, // 连接池中最大连接数量
		min: 0, // 连接池中最小连接数量
		idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
	};
}
// 创建连接
const seq = new Sequelize(database, user, password, conf);
export default seq;
