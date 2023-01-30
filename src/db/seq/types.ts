/**
 * @description 封装 sequelize 类型
 */

import Sequelize from 'sequelize';

export default {
	STRING: Sequelize.STRING,
	TEXT: Sequelize.TEXT,
	INTEGER: Sequelize.INTEGER,
	BOOLEAN: Sequelize.BOOLEAN,
	DATE: Sequelize.DATE
};
