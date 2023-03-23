/**
 * @description 查询作品
 */
import serviceWorks from '../../service/works';
import resModel from '../../res-model/index';
import resModelFailInfo from '../../res-model/failInfo/index';
import config from '../../config';
const { DEFAULT_PAGE_SIZE } = config.constant;
const { findOneWorkService, findWorkListService } = serviceWorks;
const { ErrorRes, SuccessRes } = resModel;
const { findOneWorkFailInfo, findOneWorkDbErrorFailInfo } = resModelFailInfo;

/**
 * 查询单个作品
 */
async function findOneWork(id: string, author: string) {
	if (!id || !author)
		return new ErrorRes(findOneWorkFailInfo, 'id 或 author 为空');

	let work;
	try {
		work = await findOneWorkService({
			id,
			author
		});
	} catch (ex) {
		console.error('查询单个作品', ex);
		return new ErrorRes(findOneWorkDbErrorFailInfo); // 数据库错误
	}

	// 查询失败
	if (work == null)
		return new ErrorRes(findOneWorkFailInfo, 'id 或 author 不匹配');

	// 查询成功
	return new SuccessRes(work);
}

/**
 * 获取自己的作品或模板
 */
async function findMyWorks(
	author: string,
	queryInfo: {
		id: string;
		uuid: string;
		title: string;
		status: string;
		[propName: string]: unknown;
	},
	pageInfo: { pageSize: number; pageIndex: number }
) {
	const { id, uuid, title, status, isTemplate } = queryInfo;

	let { pageIndex, pageSize } = pageInfo;
	pageIndex = pageIndex || 0;
	pageSize = pageSize || DEFAULT_PAGE_SIZE;

	const { list, count } = await findWorkListService(
		{
			id,
			uuid,
			title,
			status,
			author,
			isTemplate: isTemplate === '1'
		},
		{
			pageIndex,
			pageSize
		}
	);
	return new SuccessRes({ list, count });
}

module.exports = {
	findOneWork,
	findMyWorks
};
