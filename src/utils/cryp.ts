/**
 * @description 加密
 */

import crypto from 'crypto';
import config from '../config';
const { constant } = config;

// md5 加密
function md5Fn(content: string) {
	const md5 = crypto.createHash('md5');
	return md5.update(content).digest('hex');
}

/**
 * 加密
 * @param {string} content 要加密的内容
 */
function doCrypto(content: string) {
	const str = `password=${content}&key=${constant.PASSWORD_SECRET}`;
	return md5Fn(str);
}

export default doCrypto;
