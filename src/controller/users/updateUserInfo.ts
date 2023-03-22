/**
 * @description 修改用户信息
 */

import serviceUsers from '../../service/users';
import resModelFailInfo from '../../res-model/failInfo/index';
import resModel from '../../res-model/index';
import jwt from '../../utils/jwt';

const { updateUserInfoService } = serviceUsers;
const { updateUserInfoFailInfo, updateUserInfoDbErrorFailInfo } =
	resModelFailInfo;
const { ErrorRes, SuccessRes } = resModel;

const { jwtSign } = jwt;
/**
 * 修改用户信息
 */
async function updateUserInfo(
	curUserInfo: { username: string; iat?: number; exp?: number },
	data = {}
) {
	const { username } = curUserInfo;
	let res;
	try {
		res = await updateUserInfoService(username, data);
	} catch (ex) {
		console.error('修改用户信息', ex);
		return new ErrorRes(updateUserInfoDbErrorFailInfo); // 数据库操作失败
	}

	// 修改成功
	if (res) {
		const newUserInfo = {
			...curUserInfo,
			...data
		};
		delete newUserInfo.iat;
		delete newUserInfo.exp;
		return new SuccessRes({
			token: jwtSign(newUserInfo)
		});
	}
	// 修改失败
	return new ErrorRes(updateUserInfoFailInfo); // 失败，但数据库操作正确
}

export default updateUserInfo;
