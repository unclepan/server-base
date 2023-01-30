/**
 * @description jwt校验与签名
 */

import util from 'util';
import jwt from 'jsonwebtoken';
import config from '../config';
const { JWT_SECRET } = config.constant;
const { jwtExpiresIn } = config;

const verify = util.promisify(jwt.verify);

/**
 * jwt 校验
 * @param {string} token token
 */
async function jwtVerify(token: string) {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const data = await verify(token, JWT_SECRET); // 去掉前面的 Bearer
	return data;
}

/**
 * jwt 签名
 * @param {Object} data data
 */

function jwtSign(data: Object) {
	const token = jwt.sign(data, JWT_SECRET, { expiresIn: jwtExpiresIn });
	return token;
}

export default {
	jwtVerify,
	jwtSign
};
