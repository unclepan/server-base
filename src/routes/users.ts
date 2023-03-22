import Koa from 'koa';
import Router from 'koa-router';
import resModel from '../res-model/index';
import loginCheck from '../middlewares/loginCheck';
import genValidator from '../middlewares/genValidator';
import schema from '../validator/users';
// controller
import sendVeriCode from '../controller/users/sendVeriCode';
import loginByPhoneNumber from '../controller/users/loginByPhoneNumber';
import updateUserInfo from '../controller/users/updateUserInfo';

const { SuccessRes } = resModel;
const { phoneNumberSchema, phoneNumberVeriCodeSchema, userInfoSchema } = schema;

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

// 获取用户信息
router.get('/getUserInfo', loginCheck, async ctx => {
	// 经过了 loginCheck ，用户信息在 ctx.state.user 中
	ctx.body = new SuccessRes(ctx.state.user);
});

// 修改用户信息
router.patch(
	'/updateUserInfo',
	loginCheck,
	genValidator(userInfoSchema),
	async ctx => {
		// 经过了 loginCheck ，用户信息在 ctx.state.user 中
		const res = await updateUserInfo(ctx.state.user, ctx.request.body as {});
		ctx.body = res;
	}
);

export default router;
