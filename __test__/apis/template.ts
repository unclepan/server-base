/**
 * @description template API test
 */

import server from './_server';
const { get } = server;

describe('模板接口', () => {
	// 临时存储信息
	let TEMP_ID = '0';

	test('获取公共模板列表', async () => {
		const url = '/api/templates/';
		const { errno, data } = await get(url);
		expect(errno).toBe(0);

		const { count, list = [] } = data as { count: number; list: [] };
		if (count > 0) {
			expect(list.length).toBeGreaterThan(0);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			TEMP_ID = list[0].id;
		}
	});

	test('获取单个模板', async () => {
		const url = `/api/templates/${TEMP_ID}`;
		const { errno, data } = await get(url);

		if (TEMP_ID === '0') {
			expect(errno).toBe(13003); // 查询失败
		} else {
			expect(errno).toBe(0); // 查询成功
		}
	});
});
