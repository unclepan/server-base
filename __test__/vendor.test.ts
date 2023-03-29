/**
 * @description 第三方服务 test
 */
import path from 'path';
import sendMsg from '../src/vendor/sendMsg';
import uploadCOS from '../src/vendor/uploadCOS';
import contentSensor from '../src/vendor/contentSensor';
const { sendVeriCodeMsg } = sendMsg;
const { textCensor, imgCensor } = contentSensor;

describe('第三方 API', () => {
	test('发短信验证码', async () => {
		const phoneNumber = `18910788378`; // 注意，要把这个手机号加入到频率限制白名单里，否则 1h 之内发送的短信数量会被限制
		const res = await sendVeriCodeMsg(phoneNumber, '0000');
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const { SendStatusSet = [] } = res as any;
		const SendStatus = SendStatusSet[0] || {};
		expect(SendStatus.Code).toBe('Ok');
	});
	test(
		'上传文件到腾讯云COS',
		async () => {
			const fileName = 'a.jpeg';
			const filePath = path.resolve(__dirname, 'files', 'a.jpeg');

			const url = await uploadCOS(fileName, filePath);
			expect(url).not.toBeNull();
			expect(url.lastIndexOf(fileName)).toBeGreaterThan(0);
		},
		20 * 1000
	);
	test(
		'内容审查',
		async () => {
			// 文本审核 - 正常文字
			const text1 = 'hello world';
			const textRes1 = await textCensor(text1);
			expect(textRes1).toBeNull();

			// 文本审核 - 敏感文字，不演示
			const text2 = '首先对不起这是测试内容审核，正文来了：操你妈的傻逼';
			const textRes2 = await textCensor(text2);
			expect(textRes2).not.toBeNull();

			// 图片审核 - 正常图片
			const img1 =
				'https://base-1252254586.cos.ap-hongkong.myqcloud.com/a.jpeg';
			const imgRes1 = await imgCensor(img1);
			expect(imgRes1).toBeNull();

			// 图片审核 - 敏感图片，血腥图片
			const img2 =
				'https://base-1252254586.cos.ap-hongkong.myqcloud.com/xuexintest-646083.jpeg';
			const imgRes2 = await imgCensor(img2);
			expect(imgRes2).not.toBeNull();
		},
		20 * 1000 // 单独设置(超时时间) timeout
	);
});
