import veriCode from '../../cache/users/veriCode';
import sendMsg from '../../vendor/sendMsg';
import resModelFailInfo from '../../res-model/failInfo/index';
import resModel from '../../res-model/index';
import config from '../../config';

const { getVeriCodeFromCache, setVeriCodeToCache } = veriCode;
const { sendVeriCodeMsg } = sendMsg;
const { sendVeriCodeFrequentlyFailInfo, sendVeriCodeErrorFailInfo } =
	resModelFailInfo;
const { ErrorRes, SuccessRes } = resModel;
const { msgVeriCodeTimeout } = config;

const isTestLocal = process.env.NODE_ENV === 'test_local';

/**
 * 发送短信验证码
 * @param {string} phoneNumber 手机号
 * @param {boolean} isRemoteTest 是否测试
 */
async function sendVeriCode(phoneNumber: string, isRemoteTest: boolean) {
	// 从缓存获取验证码，看是否有效
	const codeFromCache = await getVeriCodeFromCache(phoneNumber);
	if (codeFromCache) {
		if (process.env.NODE_ENV !== 'production') {
			// 非线上环境，直接返回
			return new SuccessRes({ code: codeFromCache });
		}
		// 说明刚刚已经发送过，不要再重新发送 —— 【注意】如不做这个限制，轻易重复发送，短信服务将浪费不少钱
		return new ErrorRes(sendVeriCodeFrequentlyFailInfo);
	}

	// 缓存中没有，则发送
	const veriCode = Math.random().toString().slice(-4); // 生成随机数
	let sendSuccess = false;

	if (isTestLocal) {
		// 本地接口测试，不发短信，直接返回验证码。发短信，会有单独的接口测试。
		sendSuccess = true;
	} else if (isRemoteTest) {
		// 用于远程接口测试，也不用发短信
		sendSuccess = true;
	} else {
		// 其他情况，正式发短信
		try {
			// 短信提示的过期时间（单位分钟）
			const msgTimeoutMin = (msgVeriCodeTimeout / 60).toString();
			// 发送短信
			await sendVeriCodeMsg(phoneNumber, veriCode, msgTimeoutMin);
			sendSuccess = true;
		} catch (err) {
			sendSuccess = false;
			console.error('发送短信验证码错误', err);
			// TODO 及时报警，尽快解决问题
		}
	}

	if (!sendSuccess) {
		return new ErrorRes(sendVeriCodeErrorFailInfo);
	}

	// 发送短信成功，然后缓存，设置 timeout，重要！！！
	setVeriCodeToCache(phoneNumber, veriCode, msgVeriCodeTimeout);

	// 返回成功信息
	const resData =
		process.env.NODE_ENV === 'production' ? {} : { code: veriCode }; // 非线上环境，返回验证码
	return new SuccessRes(resData);
}

export default sendVeriCode;
