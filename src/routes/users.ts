import Koa from 'koa';
import Router from 'koa-router';

const router = new Router({
	prefix: '/users'
});

router.get('/', function (ctx: Koa.Context) {
	ctx.body = 'this is a users response!';
});

router.get('/bar', function (ctx: Koa.Context) {
	ctx.body = 'this is a users/bar response';
});

export default router;
