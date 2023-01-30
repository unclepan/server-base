import Koa from 'koa';
import path from 'path';
import views from 'koa-views';
import json from 'koa-json';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import koaStatic from 'koa-static';
import routing from './routes/index';
import jwt from './middlewares/jwt';
import cors from './middlewares/cors';
const app = new Koa();

// 支持跨域
app.use(cors);

// 配置 jwt
app.use(jwt);

// middlewares
app.use(
	bodyparser({
		enableTypes: ['json', 'form', 'text']
	})
);
app.use(json());
app.use(logger());

// 静态资源文件夹
app.use(koaStatic(path.join(__dirname, './public')));

app.use(
	views(path.join(__dirname, './views'), {
		extension: 'ejs'
	})
);

// logger
app.use(async (ctx: Koa.Context, next: Koa.Next) => {
	const start = new Date() as unknown as number;
	await next();
	const ms = (new Date() as unknown as number) - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
routing(app);

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});

export default app;
