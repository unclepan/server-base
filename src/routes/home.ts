import Koa from 'koa';
import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx: Koa.Context) => {
	ctx.body = 'Hello Koa 2!';
});

router.get('/string', async (ctx: Koa.Context) => {
	ctx.body = 'koa2 string';
});

router.get('/json', async (ctx: Koa.Context) => {
	ctx.body = {
		title: 'koa2 json'
	};
});

export default router;
