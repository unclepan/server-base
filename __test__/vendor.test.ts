/**
 * @description 第三方服务 test
 */

import sendMsg from '../src/vendor/sendMsg';
const { sendVeriCodeMsg } = sendMsg;

describe('第三方 API', () => {
	test('发短信验证码', async () => {
		const phoneNumber = `18910788378`; // 注意，要把这个手机号加入到频率限制白名单里，否则 1h 之内发送的短信数量会被限制
		const res = await sendVeriCodeMsg(phoneNumber, '0000');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { SendStatusSet = [] } = res as any;
		const SendStatus = SendStatusSet[0] || {};
		expect(SendStatus.Code).toBe('Ok');
	});
});
