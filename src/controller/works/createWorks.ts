/**
 * @description 创建作品
 */

import { v4 as uuidV4 } from 'uuid';
import serviceWorks from '../../service/works';
import resModel from '../../res-model/index';
import resModelFailInfo from '../../res-model/failInfo/index';

const { createWorkService, findOneWorkService, updateWorkService } =
	serviceWorks;
const { ErrorRes, SuccessRes } = resModel;
const {
	createWorksDbErrorFailInfo,
	createWorksFailInfo,
	forceOffLineFailInfo
} = resModelFailInfo;

/**
 * 创建作品
 */
async function createWorks(
	author: string,
	data: { title: string; [propName: string]: unknown },
	content: {
		components: [object];
		props: object;
		setting: object;
	}
) {
	const { title } = data;
	if (!title) {
		// 标题不能为空
		return new ErrorRes(createWorksFailInfo, '标题不能为空');
	}

	// uuidV4() 生成的格式如 'bc5af863-dd15-4bd9-adbe-37ea1e6450ce'
	// uuid 要用于拼接作品发布后的 url ，url 太长会导致二维码混乱。所以，只取 uuid 前几位即可。
	// uuid 太短，重复了怎么办？—— 可参考发布作品，生成 url 时的代码逻辑和注释。
	const uuid = uuidV4().slice(0, 4);
	try {
		const newWork = await createWorkService(
			{
				// 按照 WorksModel 属性
				...data,
				author,
				uuid
			},
			content
		);

		// 创建成功
		return new SuccessRes(newWork);
	} catch (ex) {
		console.error('创建作品失败', ex);
		// TODO 报警
		return new ErrorRes(createWorksDbErrorFailInfo); // 写入数据库失败
	}
}

/**
 * 复制作品（通过模板创建，也是复制）
 */
async function copyWorks(id: string, author: string) {
	const work = await findOneWorkService({ id }); // 被复制的项目不一定是自己的，所以查询条件**不加 author**

	// 是否强制下线
	if (parseInt(work.status, 10) === 3) {
		return new ErrorRes(forceOffLineFailInfo);
	}

	const { content } = work;

	// 新项目的信息，要符合 WorksModel 属性规则
	const newData = {
		title: `${work.title}-复制`,
		desc: work.desc,
		coverImg: work.coverImg

		// 其他信息，如 isTemplate status 等，都不需要
	};

	// 创新新项目
	const res = await createWorks(author, newData, content);

	// 更新源项目的使用次数
	await updateWorkService(
		{
			copiedCount: work.copiedCount + 1
		},
		{ id }
	);

	// 返回新项目
	return res;
}

export default {
	createWorks,
	copyWorks
};
