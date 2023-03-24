/**
 * @description 发布作品 缓存
 */
import cache from '../index';
const { cacheSet } = cache;

// cache key 前缀，重要！！否则数据容易混乱
// 必须和 h5-server 保持一致，且必须链接一个 redis-server
const PREFIX = 'publishWorkId-';

/**
 * 发布作品，缓存失效
 */
function publishWorkClearCache(id: string) {
	const key = `${PREFIX}${id}`;
	cacheSet(
		key,
		'' // 清空内容
	);
}

export default {
	publishWorkClearCache
};
