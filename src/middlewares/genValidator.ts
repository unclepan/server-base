import Koa from 'koa';
import Ajv from 'ajv';
import resModel from '../res-model/index';
import resModelFailInfo from '../res-model/failInfo/index';

const { ErrorRes } = resModel;
const { validateFailInfo } = resModelFailInfo;

const ajv = new Ajv({
	allErrors: true // 输出所有错误
});

/**
 * json schema 校验
 * @param {Object} schema json schema 规则
 * @param {Object} data 待校验的数据
 */
function validate(schema: object = {}, data: object = {}) {
	const valid = ajv.validate(schema, data);
	if (!valid) {
		return ajv.errors;
	}
	return undefined;
}

/**
 * 生成校验中间件
 * @param {Object} schema json schema 规则
 */
function genValidator(schema: object = {}) {
	async function validator(ctx: Koa.Context, next: Koa.Next) {
		const data = ctx.request.body || {};
		const validateError = validate(schema, data);
		if (validateError) {
			// 检验失败，返回
			ctx.body = new ErrorRes({
				...validateFailInfo, // 其中有 errno 和 message
				data: validateError // 把失败信息也返回给前端
			});
			return;
		}
		// 检验成功，继续
		await next();
	}
	return validator;
}

export default genValidator;
