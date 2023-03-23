/**
 * @description 接口返回 model
 */

interface ResParam {
	errno: number;
	data?: Object;
	message?: string;
}

/**
 * 基础模型，包括 errno data 和 message
 */
class BaseRes {
	errno: number;
	data: Object | undefined;
	message: string | undefined;
	constructor({ errno, data, message }: ResParam) {
		this.errno = errno;
		if (data) {
			this.data = data;
		}
		if (message) {
			this.message = message;
		}
	}
}

/**
 * 执行失败的数据模型
 */
class ErrorRes extends BaseRes {
	constructor({ errno = -1, message = '', data }: ResParam, addMessage = '') {
		super({
			errno,
			message: addMessage
				? `${message} - ${addMessage}` // 有追加信息
				: message,
			data
		});
	}
}

/**
 * 执行成功的数据模型
 */
class SuccessRes extends BaseRes {
	constructor(data = {}) {
		super({
			errno: 0,
			data
		});
	}
}

export default {
	ErrorRes,
	SuccessRes
};
