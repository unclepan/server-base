/**
 * @description jest server
 */

import axios from 'axios';
import { Response } from 'superagent';
import supertest from 'supertest';
import appServer from '../../src/app';
const isTestRemote = process.env.NODE_ENV === 'test_remote';
const isTestLocal = process.env.NODE_ENV === 'test_local';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let request: any;

if (isTestLocal) {
	// 本地测试才使用 supertest 。src/app 也要在此时引用，否则在 github actions 中初始化时，会报数据库连接错误。
    const server = appServer.callback() // eslint-disable-line
	request = supertest(server);
}

// 存储登录 token ，统一拼接 headers.Authorization
let TOKEN = '';
// 测试机 host
const REMOTE_HOST = 'http://182.92.xxx.xxx:8081'; // TODO 待定
//发送请求
async function ajax(
	method: string,
	url: string,
	bodyOrParams: object = {},
	headers: { Authorization?: string } = {}
): Promise<{ data: Object; errno: number }> {
	// headers加token
	if (!headers.Authorization) {
		Object.assign(headers, {
			Authorization: `Bearer ${TOKEN}`
		});
	}
	let result: { data: Object; errno: number } = { data: {}, errno: 0 };
	// 本地测试，使用 supertest
	if (isTestLocal) {
		let res: Response;
		if (method === 'get') {
			res = await request[method](url).query(bodyOrParams).set(headers);
		} else {
			res = await request[method](url).send(bodyOrParams).set(headers);
		}
		result = res.body;
	}

	// 远程测试，使用 axios ，访问测试机
	if (isTestRemote) {
		const remoteUrl = `${REMOTE_HOST}${url}`;
		const conf = {
			method,
			url: remoteUrl,
			headers,
			params: {},
			data: {}
		};
		if (method === 'get') {
			conf.params = bodyOrParams;
		} else {
			conf.data = bodyOrParams;
		}
		const res = await axios(conf);
		result = res.data;
	}

	// 返回结果
	return result;
}

export default {
	setToken(token: string) {
		console.log('setToken...', token);
		TOKEN = token;
	},
	async get(url: string, params = {}) {
		const res = await ajax('get', url, params);
		return res;
	},
	async post(url: string, body = {}) {
		const res = await ajax('post', url, body);
		return res;
	},
	async patch(url: string, body = {}) {
		const res = await ajax('patch', url, body);
		return res;
	},
	async del(url: string, body = {}) {
		const res = await ajax('delete', url, body);
		return res;
	}
};
