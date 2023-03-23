import Koa from 'koa';
import Router from 'koa-router';
import loginCheck from '../middlewares/loginCheck';
import genValidator from '../middlewares/genValidator';
import schema from '../validator/works';

import controllerCreateWorks from '../controller/works/createWorks';
const { createWorks, copyWorks } = controllerCreateWorks;

const { workInfoSchema } = schema;

const router = new Router({
	prefix: '/api/works'
});

// 创建空白作品
router.post(
	'/',
	loginCheck,
	genValidator(workInfoSchema),
	async (ctx: Koa.Context) => {
		// 经过了 loginCheck ，用户信息在 ctx.userInfo 中
		const { username } = ctx.state.user;
		const {
			title = '',
			desc = '',
			content = { components: [{}], props: {}, setting: {} }
		} = ctx.request.body as {
			title: string;
			desc: boolean;
			content: {
				components: [object];
				props: object;
				setting: object;
			};
		};

		const res = await createWorks(username, { title, desc }, content);
		ctx.body = res;
	}
);

export default router;
