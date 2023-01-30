/**
 * @description 数据库连接测试
 */

import seq from './index';

// 测试连接，直接运行 ts-node src/db/seq/conn-test.ts
seq
	.authenticate()
	.then(() => {
		console.log('ok');
	})
	.catch(() => {
		console.log('fail');
	})
	.finally(() => {
		process.exit();
	});
