/**
 * @description 修改作品
 */

import _ from 'lodash';
import serviceWorks from '../../service/works';
import serviceUsers from '../../service/users';
import resModel from '../../res-model/index';
import resModelFailInfo from '../../res-model/failInfo/index';

const { updateWorkService } = serviceWorks;
const { findOneUserService } = serviceUsers;
const { ErrorRes, SuccessRes } = resModel;
const { updateWorkFailInfo, updateWorkDbErrorFailInfo, transferWorkFailInfo } =
	resModelFailInfo;
/**
 * 修改作品
 * @param {string} id id
 */
async function updateWorks(id: string, author: string, data = {}) {
	// 保证数据不为空
	if (!id || !author)
		return new ErrorRes(updateWorkFailInfo, 'id 或 author 不能为空');
	if (_.isEmpty(data))
		return new ErrorRes(updateWorkFailInfo, '更新数据不能为空');

	let res;
	try {
		res = await updateWorkService(data, { id, author });
	} catch (ex) {
		console.error('更新作品错误', id, ex);
		// TODO 报警：`更新作品 ${id} 错误`
		return new ErrorRes(updateWorkDbErrorFailInfo); // 数据库错误
	}

	// 更新成功
	if (res) return new SuccessRes();
	// 更新失败
	return new ErrorRes(updateWorkFailInfo, 'id 或 author 不匹配');
}

/**
 * 转赠作品
 */
async function transferWorks(
	id: string,
	author: string,
	receiverUsername: string
) {
	// 两者一样
	if (author === receiverUsername)
		return new ErrorRes(transferWorkFailInfo, '作者和接收人相同');

	// 判断接收者是否存在
	const receiver = await findOneUserService({ username: receiverUsername });
	if (receiver == null)
		return new ErrorRes(transferWorkFailInfo, '接收人未找到');

	const res = await updateWorks(id, author, {
		author: receiverUsername
	});
	return res;
}

export default {
	updateWorks,
	transferWorks
};
