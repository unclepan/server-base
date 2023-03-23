/**
 * @description 查询模板
 */
import serviceWorks from '../../service/works';
import cacheTemplates from '../../cache/works/templates';
import resModelFailInfo from '../../res-model/failInfo/index';
import resModel from '../../res-model/index';
import config from '../../config';
const { DEFAULT_PAGE_SIZE } = config.constant;
const { findOneWorkService, findWorkListService } = serviceWorks;
const { publicTemplatesCacheGet, publicTemplatesCacheSet } = cacheTemplates;
const { findOneWorkFailInfo, findOneWorkDbErrorFailInfo } = resModelFailInfo;
const { ErrorRes, SuccessRes } = resModel;
/**
 * 隐藏手机号
 */
function hidePhoneNumber(number = '') {
	const n = number.toString();
	if (!n) return n;
	const reg = /^1[3456789]\d{9}$/; // 手机号正则
	if (reg.test(n) === false) return n;
	return n.slice(0, 3) + '****' + n.slice(-4);
}

/**
 * 格式化公共的模板数据，隐藏一些信息
 */
function formatTemplate(
	template:
		| {
				author: string;
				user: {
					dataValues: {
						userName: string;
					};
				};
				[propName: string]: unknown;
		  }
		| unknown[]
): unknown {
	if (Array.isArray(template)) {
		// 传入了 list
		return template.map(t => formatTemplate(t));
	}

	// 传入了单个 template
	const result = template;

	// 用户名若是手机号，则隐藏手机号
	result.author = hidePhoneNumber(result.author);
	if (result.user) {
		const user = result.user.dataValues;
		user.userName = hidePhoneNumber(user.userName);
	}

	return result;
}

/**
 * 查询公共模板
 */
async function findPublicTemplates(
	queryInfo: {
		id?: string;
		uuid?: string;
		title?: string;
		[propName: string]: unknown;
	},
	pageInfo: { pageSize?: number; pageIndex?: number }
) {
	// 试图从 cache 中获取
	const templatesFromCache = await publicTemplatesCacheGet(queryInfo, pageInfo);
	if (templatesFromCache != null) {
		// 从缓存中获取
		return new SuccessRes(templatesFromCache);
	}

	const { id, uuid, title } = queryInfo;
	let { pageIndex, pageSize } = pageInfo;
	pageIndex = pageIndex || 0;
	pageSize = pageSize || DEFAULT_PAGE_SIZE;

	// 缓存中没有，从数据库获取
	const { list, count } = await findWorkListService(
		{
			id,
			uuid,
			title,
			isTemplate: true,
			isPublic: true // 公开的
		},
		{
			pageIndex,
			pageSize
		}
	);

	// 格式化模板
	const formatList = formatTemplate(list);

	// 记录到缓存
	publicTemplatesCacheSet(queryInfo, pageInfo, { list: formatList, count });

	// 返回
	return new SuccessRes({ list: formatList, count });
}

/**
 * 查询单个作品
 */
async function findOneTemplate(id: string) {
	if (!id) return new ErrorRes(findOneWorkFailInfo, 'id 为空');

	let template;
	try {
		template = await findOneWorkService({
			id,
			isTemplate: true,
			isPublic: true // 公开的
		});
	} catch (ex) {
		console.error('查询单个模板', ex);
		return new ErrorRes(findOneWorkDbErrorFailInfo); // 数据库错误
	}

	// 查询失败
	if (template == null) return new ErrorRes(findOneWorkFailInfo);

	// 格式忽视
	template = formatTemplate(template);

	// 查询成功
	return new SuccessRes(template as object);
}

export default {
	findPublicTemplates,
	findOneTemplate
};
