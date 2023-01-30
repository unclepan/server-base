/**
 * @description 登录校验
 */
import Koa from 'koa';
import cookie from 'cookie';
import jwt from '../utils/jwt';
import resModel from '../res-model/index';
import resModelfailInfo from '../res-model/failInfo/index';
const { jwtVerify } = jwt;
const { ErrorRes } = resModel;
const { loginCheckFailInfo } = resModelfailInfo;

export default async function loginCheck(ctx: Koa.Context, next: Koa.Next) {
	// 失败信息
	const errRes = new ErrorRes(loginCheckFailInfo);

	// 获取 token
	const cookies = cookie.parse(ctx.header.cookie || '');
	const { token } = cookies;
	if (!token) {
		ctx.body = errRes;
		return;
	}
	let flag = true;
	try {
		const userInfo = await jwtVerify(token);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (!!userInfo.password) delete userInfo.password; // 屏蔽密码
		// 验证成功，获取 userInfo
		ctx.state.user = userInfo;
	} catch (ex) {
		flag = false;
		ctx.body = errRes;
	}

	if (flag) await next();
}
