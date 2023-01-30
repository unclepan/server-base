import Koa from 'koa';
import path from 'path';
import glob from 'glob'; // 获取匹配规则的所有文件

const PRODUCTION = process.env.NODE_ENV === 'production';
const route = (app: Koa) => {
	try {
		glob
			.sync(
				path.resolve(
					__dirname,
					PRODUCTION ? './**/!(index).js' : './**/!(index).ts'
				)
			)
			.forEach((file: string) => {
				if (PRODUCTION) {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					const router = require(file);
					app.use(router.default.routes());
					app.use(router.default.allowedMethods());
				} else {
					import(file).then(router => {
						app.use(router.default.routes());
						app.use(router.default.allowedMethods());
					});
				}
			});
	} catch (err) {
		console.log(err);
	}
};

export default route;
