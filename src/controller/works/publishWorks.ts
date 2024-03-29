/**
 * @description 发布作品
 */

import _ from 'lodash';
import serviceWorks from '../../service/works';
import resModel from '../../res-model/index';
import resModelFailInfo from '../../res-model/failInfo/index';
import config from '../../config';
import cachePublish from '../../cache/works/publish';
import contentSensor from '../../vendor/contentSensor';

const { updateWorkService, findOneWorkService, updatePublishContentService } =
	serviceWorks;
const { ErrorRes, SuccessRes } = resModel;
const {
	publishWorkFailInfo,
	publishWorkDbErrorFailInfo,
	forceOffLineFailInfo
} = resModelFailInfo;
const { FEOrigin } = config;
const { publishWorkClearCache } = cachePublish;
const { textCensor, imgCensor } = contentSensor;

// 作品接口定义
interface Work {
	title: string;
	desc: string;
	content: {
		props: { backgroundImage: string };
		setting: { shareImg: string };
		components: [
			{
				name: string;
				props: { text: string; imageSrc: string };
			}
		];
	};
}

/**
 * 获取所有图片
 */
function getWorkImgs(work: Work) {
	const { content } = work;
	const { components, props, setting } = content;
	const { backgroundImage } = props; // 背景图片
	const { shareImg = '' } = setting; // 分享小图标

	// 存储结果
	const imgs: string[] = [];

	if (backgroundImage) imgs.push(backgroundImage);
	if (shareImg) imgs.push(shareImg);

	// 遍历所有组件
	components.forEach(component => {
        const { name, props } = component // eslint-disable-line
		if (name !== 'l-image') return; // 不是图片组件
		const { imageSrc } = props;
		if (imageSrc) imgs.push(imageSrc);
	});

	return imgs;
}

/**
 * 获取所有文本
 * @param {object} work 作品信息
 */
function getWorkText(work: Work) {
	const { title = '', desc = '', content } = work;
	const { components = [] } = content;

	// 存储结果
	const result: string[] = [];

	// 增加标题、描述
	result.push(title);
	result.push(desc);

	// 遍历文本组件
	components.forEach(component => {
		const { name, props } = component;
		if (name !== 'l-text') return; // 不是文本组件
		const { text = '' } = props;
		if (text) result.push(text);
	});

	return result.join('-');
}
/**
 * 作品内容审核
 */
async function contentCensor(work: Work) {
	// 1. 审查所有文本内容
	const text = getWorkText(work);
	const textCensorRes = await textCensor(text); // 返回 null | Array
	if (textCensorRes) {
		// 审核文本有问题，则直接返回错误，先不管图片（审核文本价格便宜，审核图片价格贵，贵的延后去做）
		return textCensorRes;
	}

	// 2. 审查图片内容
	const imgs = getWorkImgs(work);
	if (imgs.length === 0) {
		// 没有图片需要审核
		return null;
	}
	const imgCensorResList = await Promise.all(
		imgs.map(imgUrl => {
			const res = imgCensor(imgUrl); // 返回 null | Array
			return res;
		})
	);
	const imgCensorResListFilter = imgCensorResList.filter(r => !!r); // 过滤掉 null
	if (imgCensorResListFilter.length === 0) {
		return null; // 图片审核没问题
	}
	return _.flatten(imgCensorResListFilter); // [[a,b], [c]] 转换为 [a, b, c]
}

/**
 * 发布项目
 */
async function publishWork(id: string, author: string, isTemplate = false) {
	const work = await findOneWorkService({
		id,
		author
	});
	if (work == null)
		return new ErrorRes(publishWorkFailInfo, 'id 或者作者不匹配');

	// 是否强制下线
	if (parseInt(work.status, 10) === 3) {
		return new ErrorRes(forceOffLineFailInfo);
	}

	// 内容审核（非 dev 环境下）
	if (process.env.NODE_ENV !== 'development') {
		const censorResult = await contentCensor(work);
		if (censorResult) {
			// 审核失败，打印日志
			console.log(
				`id ${id} 作品内容检查失败`,
				JSON.stringify(censorResult, null, 4)
			);

			// 需要输出 data ，所有就自定义 ErrorRes 了 ，不用 failInfo 了
			return new ErrorRes({
				errno: -1,
				data: censorResult,
				message: '内容审核失败'
			});
		}
	}

	// 发布，需要更新的数据。要遵守 WorksModel 的属性规范
	const updateData = {
		status: 2,
		latestPublishAt: new Date()
	};
	if (isTemplate) {
		// 发布为模板
		Object.assign(updateData, {
			isTemplate: true
		});
	}

	let result;
	try {
		// 更新发布的内容
		const publishContentId = await updatePublishContentService(
			work.content,
			work.publishContentId
		);

		// 发布项目（更新 status）
		result = await updateWorkService(
			{
				publishContentId,
				...updateData
			},
			{ id, author }
		);
	} catch (ex) {
		console.error('发布作品错误', id, ex);
		// TODO 报警。title 中要有作品 id `发布作品 ${id} 错误` ，报警会根据 title 缓存
		return new ErrorRes(publishWorkDbErrorFailInfo);
	}

	if (!result) return new ErrorRes(publishWorkFailInfo); // 发布失败

	// 重新发布，清空缓存
	publishWorkClearCache(id);

	// 发布成功，返回连接
	// 注意，由于 uuid 是 4 位的，为了防止重复，再把 id 拼接上，这样就唯一了
	const url = `${FEOrigin}/p/${work.id}-${work.uuid}`;
	return new SuccessRes({ url });
}

export default {
	publishWork
};
