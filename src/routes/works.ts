import Koa from 'koa';
import Router from 'koa-router';
import loginCheck from '../middlewares/loginCheck';
import genValidator from '../middlewares/genValidator';
import schema from '../validator/works';

import controllerCreateWorks from '../controller/works/createWorks';
import controllerFindWorks from '../controller/works/findWorks';
import controllerUpdateWorks from '../controller/works/updateWorks';
import controllerDeleteWorks from '../controller/works/deleteWorks';
import controllerPublishWorks from '../controller/works/publishWorks';
const { createWorks, copyWorks } = controllerCreateWorks;
const { findOneWork, findMyWorks } = controllerFindWorks;
const { updateWorks, transferWorks } = controllerUpdateWorks;
const { deleteWork, putBackWork } = controllerDeleteWorks;
const { publishWork } = controllerPublishWorks;

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
		// 经过了 loginCheck ，用户信息在 ctx.state.user 中
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

// 查询单个作品
router.get('/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const { username } = ctx.state.user;

	const res = await findOneWork(id, username);
	ctx.body = res;
});

// 修改作品信息
router.patch('/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const { username } = ctx.state.user;

	const res = await updateWorks(id, username, ctx.request.body || {});
	ctx.body = res;
});

// 复制作品（通过模板创建作品，也是复制）
router.post('/copy/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const { username } = ctx.state.user;

	const res = await copyWorks(id, username);
	ctx.body = res;
});

// 删除作品
router.delete('/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const { username } = ctx.state.user;

	const res = await deleteWork(id, username);
	ctx.body = res;
});

// 恢复删除
router.post('/put-back/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const { username } = ctx.state.user;

	const res = await putBackWork(id, username);
	ctx.body = res;
});

// 转赠作品
router.post('/transfer/:id/:receiver', loginCheck, async ctx => {
	const { id, receiver } = ctx.params;
	const { username } = ctx.state.user;

	const res = await transferWorks(id, username, receiver);
	ctx.body = res;
});

// 获取自己的作品或模板
router.get('/', loginCheck, async ctx => {
	const { username } = ctx.state.user;
	const {
		title = '',
		status,
		isTemplate = '0',
		pageIndex,
		pageSize
	} = ctx.query as {
		title: string;
		status: string;
		isTemplate: string;
		pageIndex: number;
		pageSize: number;
		[propName: string]: unknown;
	};
	const res = await findMyWorks(
		username,
		{ title, status, isTemplate },
		{ pageIndex, pageSize }
	);
	ctx.body = res;
});

// 发布作品
router.post('/publish/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const { username } = ctx.state.user;
	const res = await publishWork(id, username);
	ctx.body = res;
});

// 发布为模板
router.post('/publish-template/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const { username } = ctx.state.user;
	const res = await publishWork(id, username, true);
	ctx.body = res;
});

export default router;
