/**
 * @description 短信验证码 缓存
 */

import cache from '../index';
const { cacheSet, cacheGet } = cache;
// cache key 前缀，重要！！否则数据容易混乱
const PREFIX = 'phoneVeriCode-';

/**
 * 从缓存获取验证码
 * @param {string} phoneNumber 手机号
 */
async function getVeriCodeFromCache(phoneNumber: string) {
	const key = `${PREFIX}${phoneNumber}`;
	const code = await cacheGet(key);
	if (!code) return code;
	return code.toString(); // cacheGet 方法中有 JSON.parse
}

/**
 * 缓存验证码
 * @param {string} phoneNumber 手机号
 * @param {string} veriCode 验证码
 * @param {number} timeout timeout 单位 s
 */
async function setVeriCodeToCache(
	phoneNumber: string,
	veriCode: string,
	timeout: number
) {
	const key = `${PREFIX}${phoneNumber}`;
	cacheSet(key, veriCode, timeout);
}

export default {
	getVeriCodeFromCache,
	setVeriCodeToCache
};
