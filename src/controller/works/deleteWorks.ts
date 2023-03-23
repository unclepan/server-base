/**
 * @description 删除作品
 */

import serviceWorks from '../../service/works';
import resModel from '../../res-model/index';
import resModelFailInfo from '../../res-model/failInfo/index';

const { updateWorkService, findOneWorkService } = serviceWorks;
const { ErrorRes, SuccessRes } = resModel;
const { deleteWorkFailInfo, deleteWorkDbErrorFailInfo } = resModelFailInfo;
/**
 * 删除作品
 */
async function deleteWork(id: string, author: string, putBack = false) {
	let res;
	try {
		// 假删除，更新 status
		const status = putBack === true ? 1 : 0;
		res = await updateWorkService(
			{ status },
			{ id, author } // 条件里加 author ，防止删除别人的项目
		);
	} catch (ex) {
		console.error('删除作品错误', ex);
		return new ErrorRes(deleteWorkDbErrorFailInfo);
	}

	// 删除成功
	if (res) return new SuccessRes();
	// 删除失败
	return new ErrorRes(deleteWorkFailInfo, 'id 或 author 不匹配');
}

/**
 * 恢复删除
 */
async function putBackWork(id: string, author: string) {
	const res = await deleteWork(id, author, true);
	return res;
}

module.exports = {
	deleteWork,
	putBackWork
};
