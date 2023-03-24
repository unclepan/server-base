/**
 * @description 正式环境
 */
import { ConfigParam } from '.';

const config: ConfigParam = {
	// mysql 连接配置
	mysqlConf: {
		host: 'localhost',
		user: 'root',
		password: 'Yp123456',
		port: 3306,
		database: 'oo_test_course'
	},
	// mongodb 连接配置, nodejs最新版，需要把localhost改成127.0.0.1
	mongodbConf: {
		host: '127.0.0.1',
		user: '',
		password: '',
		port: 27017,
		dbName: 'oo_test_course'
	},
	// redis 连接配置
	redisConf: {
		user: '',
		port: 6379,
		host: '127.0.0.1',
		password: ''
	},
	// 常量配置
	constant: {
		// 密码加密 秘钥
		PASSWORD_SECRET: 'WJiol_8776#',
		// jwt 秘钥
		JWT_SECRET: 'secret_for-json#web$token',
		// jwt 可忽略的 path：全部忽略即可，需要登录验证的，自己用 loginCheck
		JWT_IGNORE_PATH: [/\//],
		// 查询列表，默认分页配置
		DEFAULT_PAGE_SIZE: 8
	},
	// jwt 过期时间
	jwtExpiresIn: '1d', // 1. 字符串，如 '1h' '2d'； 2. 数字，单位是 s
	// cors origin
	corsOrigin: '*',
	// 短信验证码缓存时间，单位 s
	msgVeriCodeTimeout: 5 * 60,
	// 发布出来的前端展示域名
	FEOrigin: 'http://localhost:3001'
};

export default config;
