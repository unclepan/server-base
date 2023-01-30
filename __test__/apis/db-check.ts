/**
 * @description 检查数据库连接
 */

import server from './_server';
const { get } = server;

test('数据库连接', async () => {
	const { data, errno } = await get('/api/test/db-check');
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const { redisConn, mysqlConn, mongodbConn } = data;
	expect(errno).toBe(0);
	expect(redisConn).toBe(true);
	expect(mysqlConn).toBe(true);
	expect(mongodbConn).toBe(true);
});
