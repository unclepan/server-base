import Koa from 'koa';
import Router from 'koa-router';
import resModel from '../res-model/index';
import loginCheck from '../middlewares/loginCheck';
import genValidator from '../middlewares/genValidator';
import schema from '../validator/users';
const { phoneNumberSchema, phoneNumberVeriCodeSchema, userInfoSchema } = schema;

// controller
import sendVeriCode from '../controller/users/sendVeriCode';
import loginByPhoneNumber from '../controller/users/loginByPhoneNumber';

const router = new Router({
	prefix: '/api/users'
});

// 生成短信验证码
router.post(
	'/genVeriCode',
	genValidator(phoneNumberSchema),
	async (ctx: Koa.Context) => {
		const { phoneNumber, isRemoteTest } = ctx.request.body as {
			phoneNumber: string;
			isRemoteTest: boolean;
		};
		// 尝试发送验证码
		const res = await sendVeriCode(phoneNumber, isRemoteTest);
		ctx.body = res;
	}
);

// 使用手机号登录
router.post(
	'/loginByPhoneNumber',
	genValidator(phoneNumberVeriCodeSchema),
	async ctx => {
		const { phoneNumber, veriCode } = ctx.request.body as {
			phoneNumber: string;
			veriCode: string;
		};
		const res = await loginByPhoneNumber(phoneNumber, veriCode);
		ctx.body = res;
	}
);

export default router;
