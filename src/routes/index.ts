import Koa from 'koa';
import path from 'path';
import glob from 'glob'; // 获取匹配规则的所有文件

const PROJECT_STATUS = process.env.PROJECT_STATUS === 'source';

const route = (app: Koa) => {
	try {
		glob
			.sync(
				path.resolve(
					__dirname,
					PROJECT_STATUS ? './**/!(index).ts' : './**/!(index).js'
				)
			)
			.forEach((file: string) => {
				if (PROJECT_STATUS) {
					import(file).then(router => {
						app.use(router.default.routes());
						app.use(router.default.allowedMethods());
					});
				} else {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					const router = require(file);
					app.use(router.default.routes());
					app.use(router.default.allowedMethods());
				}
			});
	} catch (err) {
		console.log(err);
	}
};

export default route;
