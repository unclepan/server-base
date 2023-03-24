/**
 * @description 模板 router
 */

import Router from 'koa-router';

// controller
import controllerFindTemplate from '../controller/works/findTemplate';
const { findPublicTemplates, findOneTemplate } = controllerFindTemplate;

// 路由前缀
const router = new Router({
	prefix: '/api/templates'
});

// 获取公共模板
router.get('/', async ctx => {
	const {
		title = '',
		pageIndex,
		pageSize
	} = ctx.query as {
		title: string;
		pageIndex: number;
		pageSize: number;
		[propName: string]: unknown;
	};
	const res = await findPublicTemplates({ title }, { pageIndex, pageSize });
	ctx.body = res;
});

// 查询单个公共模板
router.get('/:id', async ctx => {
	const { id } = ctx.params;
	const res = await findOneTemplate(id);
	ctx.body = res;
});
export default router;
