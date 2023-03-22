/**
 * @description user 数据操作
 */

import _ from 'lodash';
import UserModel from '../models/UserModel';

/**
 * 查找用户信息
 */
async function findOneUserService({
	username,
	password,
	phoneNumber
}: {
	username?: string;
	password?: string;
	phoneNumber?: string;
}) {
	// 拼接查询条件
	const whereOpt = {};
	if (username) {
		Object.assign(whereOpt, { username });
	}
	if (password) {
		// 用户名和密码在一块，因为密码可能重复
		Object.assign(whereOpt, { username, password });
	}
	if (phoneNumber) Object.assign(whereOpt, { phoneNumber });

	// 无查询条件，则返回空
	if (_.isEmpty(whereOpt)) return null;

	// 查询
	const result = await UserModel.findOne({
		where: whereOpt
	});
	if (result == null) {
		// 未查到用户
		return result;
	}

	// 返回查询结果
	return result.dataValues;
}

/**
 * 创建用户
 */
async function createUserService(data = {}) {
	const result = await UserModel.create(data);
	return result.dataValues;
}

/**
 * 修改用户信息
 */
async function updateUserInfoService(username: string, data = {}) {
	if (!username) return false;
	if (_.isEmpty(data)) return false; // 没有要修改的
	const result = await UserModel.update(data, {
		where: {
			username
		}
	});
	return result[0] !== 0;
}

export default {
	findOneUserService,
	createUserService,
	updateUserInfoService
};
