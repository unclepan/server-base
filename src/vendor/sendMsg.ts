/**
 * @description 模拟发送短信
 */

/**
 * 发送短信验证码
 * @param {string} phoneNumber 手机号
 * @param {string} code 验证码
 * @param {string} timeout 过期时间，分钟
 */
async function sendVeriCodeMsg(
	phoneNumber: string,
	code: string,
	timeout: string
) {
	if (!phoneNumber || !code)
		return Promise.reject(new Error('手机号或验证码为空'));

	return Promise.resolve('ok'); // 模拟一个异步
}

export default {
	sendVeriCodeMsg
};
