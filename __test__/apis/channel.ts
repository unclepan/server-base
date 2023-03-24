/**
 * @description channel API test
 */
import server from './_server';
const { get, post, patch, del } = server;

describe('渠道接口', () => {
	// 随机数
	const R = Math.random().toString().slice(-4);

	// 临时作品信息
	let WORK_ID = '';
	let CHANNEL_ID = '';

	test('获取自己的一个作品 ID', async () => {
		const url = '/api/works/';
		const { errno, data } = await get(url);
		expect(errno).toBe(0);

		const { count, list = [] } = data as { count: number; list: [] };
		expect(count).toBeGreaterThan(0);
		expect(list.length).toBeGreaterThan(0);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		WORK_ID = list[0].id;
	});

	test('创建渠道', async () => {
		const url = '/api/channel/';
		const { errno, data } = await post(url, {
			name: '渠道1',
			workId: WORK_ID
		});
		expect(errno).toBe(0);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		CHANNEL_ID = data.id;
	});

	test('更新渠道名称', async () => {
		const url = `/api/channel/updateName/${CHANNEL_ID}`;
		const { errno } = await patch(url, {
			name: '渠道2'
		});
		expect(errno).toBe(0);
	});

	test('查询作品渠道', async () => {
		const url = `/api/channel/getWorkChannels/${WORK_ID}`;
		const { errno, data } = await get(url);
		expect(errno).toBe(0);

		const { count, list = [] } = data as { count: number; list: [] };
		expect(count).toBeGreaterThan(0);
		expect(list.length).toBeGreaterThan(0);
	});

	test('删除渠道', async () => {
		const url = `/api/channel/${CHANNEL_ID}`;
		const { errno } = await del(url);
		expect(errno).toBe(0);
	});
});
