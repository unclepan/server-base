/**
 * @description 公共模板 - 缓存
 */

import cache from '../index';

import util from '../../utils/util';
const { getSortedObjStr } = util;
const { cacheSet, cacheGet } = cache;

/**
 * 获取 key
 */
function getCacheKey(queryInfo = {}, pageInfo = {}) {
	const PREFIX = 'public-templates-';
	const queryInfoStr = getSortedObjStr(queryInfo);
	const pageInfoStr = getSortedObjStr(pageInfo);
	const key = `${PREFIX}${queryInfoStr}-${pageInfoStr}`;
	return key;
}

/**
 * 公共模板 - 缓存 get
 */
async function publicTemplatesCacheGet(queryInfo = {}, pageInfo = {}) {
	const key = getCacheKey(queryInfo, pageInfo);
	const templates = await cacheGet(key);
	if (!templates) return null; // 无缓存
	return templates; // cacheGet 中有 JSON.parse
}

/**
 * 公共模板 - 缓存 set
 */
function publicTemplatesCacheSet(
	queryInfo = {},
	pageInfo = {},
	templates: string | Object | null
) {
	if (templates == null) return;

	const key = getCacheKey(queryInfo, pageInfo);
	cacheSet(
		key,
		templates,
		60 // timeout 设置为 1min，单位是 s
	);
}

export default {
	publicTemplatesCacheGet,
	publicTemplatesCacheSet
};
