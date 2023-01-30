/**
 * @description 连接redis
 */

import * as redis from 'redis';
import config from '../config';
const { redisConf } = config;
const { host, port, user, password } = redisConf;

// 拼接连接字符串
let url = `redis://${host}:${port}`; // dev 环境
if (user && password) {
	url = `redis://${user}:${password}@${host}:${port}`; // prd 环境
}

// 连接
const redisClient = redis.createClient({ url });
redisClient.connect();

redisClient.on('error', err => {
	console.error('redis connect error', err);
});

// 可运行 ts-node src/db/redis.ts 测试连接
// redisClient.on('connect', () => {
//     console.log('redis connect success')
//     redisClient.quit()
// })

export default redisClient;
