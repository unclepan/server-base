import devConfig from './dev.config';
import testConfig from './test.config';
import prodConfig from './prod.config';

const { NODE_ENV } = process.env;

// 类型定义
export interface ConfigParam {
	mysqlConf: {
		host: string;
		user: string;
		password: string;
		port: number;
		database: string;
	};
	// mongodb 连接配置, nodejs最新版，需要把localhost改成127.0.0.1
	mongodbConf: {
		host: string;
		user: string;
		password: string;
		port: number;
		dbName: string;
	};
	redisConf: {
		host: string;
		user: string;
		password: string;
		port: number;
	};
	constant: {
		// 密码加密 秘钥
		PASSWORD_SECRET: string;
		// jwt 秘钥
		JWT_SECRET: string;
		// jwt 可忽略的path：全部忽略即可，需要登录验证的，自己用 loginCheck
		JWT_IGNORE_PATH: RegExp[];
		// 查询列表，默认分页配置
		DEFAULT_PAGE_SIZE: number;
	};
	// jwt 过期时间
	jwtExpiresIn: string; // 1. 字符串，如 '1h' '2d'； 2. 数字，单位是 s
	// cors origin
	corsOrigin: string;
	// 短信验证码缓存时间，单位 s
	msgVeriCodeTimeout: number;
	// 发布出来的前端展示域名
	FEOrigin: string;
	// 腾讯云短信服务配置
	tencentMsgConf: {
		// 获取密钥 https://console.cloud.tencent.com/cam/capi
		SECRET_ID: string;
		SECRET_KEY: string;
	};
}

class GlobalConfig {
	config: ConfigParam;

	constructor() {
		this.config = this.getConfig();
	}

	getConfig() {
		let config: ConfigParam = { ...devConfig };
		switch (NODE_ENV) {
			case 'development':
				config = Object.assign(config, devConfig);
				break;
			case 'testing':
				config = Object.assign(config, testConfig);
				break;
			case 'production':
				config = Object.assign(config, prodConfig);
				break;
			default:
				config = Object.assign(config, devConfig);
		}
		return config;
	}
}

const globalConfig = new GlobalConfig();

const GLOBAL_CONFIG: ConfigParam = globalConfig.config;
export default GLOBAL_CONFIG;
