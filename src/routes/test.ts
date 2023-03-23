import Router from 'koa-router';
import modelsWorkContentModel from '../models/WorkContentModel';
import UserModel from '../models/UserModel';
import redisCache from '../cache/index';
import jwt from '../utils/jwt';
import loginCheck from '../middlewares/loginCheck';
const { jwtSign } = jwt;
const { cacheGet, cacheSet } = redisCache;
const { WorkContentModel } = modelsWorkContentModel;

const router = new Router({
	prefix: '/api/test'
});

// 测试数据库连接
router.get('/db-check', async ctx => {
	// 测试 mongodb 连接
	let mongodbConn;
	try {
		mongodbConn = true;
		await WorkContentModel.findOne();
	} catch (ex) {
		mongodbConn = false;
	}

	// 测试 redis 连接
	cacheSet('name', 'biz editor sever OK - by redis');
	const redisTestVal = await cacheGet('name');

	// 测试 mysql 连接
	let mysqlConn;
	try {
		mysqlConn = true;
		await UserModel.findOne();
	} catch (ex) {
		mysqlConn = false;
	}

	ctx.body = {
		errno: 0,
		data: {
			name: 'server base',
			mongodbConn,
			mysqlConn,
			redisConn: redisTestVal != null
		}
	};
});

router.get('/auth', loginCheck, async ctx => {
	ctx.body = ctx.state.user; // 该中间件将验证后的用户数据直接返回给浏览器
});

router.get('/public/token', async ctx => {
	const token = jwtSign({ name: 'yang' });
	ctx.cookies.set('token', token, {
		domain: 'localhost', // 设置 cookie 的域
		path: '/', // 设置 cookie 的路径
		maxAge: 3 * 60 * 60 * 1000, // cookie 的有效时间 ms
		expires: new Date('2021-12-30'), // cookie 的失效日期，如果设置了 maxAge，expires 将没有作用
		httpOnly: true, // 是否要设置 httpOnly
		overwrite: true // 是否要覆盖已有的 cookie 设置
	});
	ctx.body = token;
});

export default router;
