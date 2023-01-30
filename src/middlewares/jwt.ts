/**
 * @description 封装 jwt 中间件
 */

import jwtKoa from 'koa-jwt';
import config from '../config';
const { JWT_SECRET, JWT_IGNORE_PATH } = config.constant;

export default jwtKoa({
	secret: JWT_SECRET,
	cookie: 'jwt_token', // 使用 cookie 存储 token
	debug: true // 开启debug可以看到准确的错误信息
}).unless({
	// 定义哪些路由忽略jwt 验证
	path: JWT_IGNORE_PATH
});
