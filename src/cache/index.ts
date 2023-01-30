/**
 * @description 数据缓存
 */

import redisClient from '../db/redis';

/**
 * redis set
 * @param {string} key key
 * @param {string | Object} val val
 * @param {number} timeout 过期时间，单位 s ，默认 1h
 */
function cacheSet(
	key: string,
	val: string | Object,
	timeout: number = 60 * 60
) {
	let formatVal;
	if (typeof val === 'object') {
		formatVal = JSON.stringify(val);
	} else {
		formatVal = val;
	}
	redisClient.set(key, formatVal);
	redisClient.expire(key, timeout);
}

/**
 * redis get
 * @param {string} key key
 */
function cacheGet(key: string) {
	const promise = new Promise((resolve, reject) => {
		redisClient
			.get(key)
			.then(val => {
				if (val == null) {
					resolve(null);
					return;
				}
				try {
					resolve(JSON.parse(val));
				} catch (e) {
					resolve(val);
				}
			})
			.catch(err => {
				reject(err);
			});
	});
	return promise;
}

export default {
	cacheSet,
	cacheGet
};
