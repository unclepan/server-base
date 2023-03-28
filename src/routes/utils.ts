/**
 * @description 路由 工具类
 */

import Router from 'koa-router';

// 中间件
import loginCheck from '../middlewares/loginCheck';

// controller
import uploadImg from '../controller/utils/uploadImg';
// 路由前缀
const router = new Router({
	prefix: '/api/utils'
});

// 上传图片（form-data 形式，支持多文件上传）
router.post('/upload-img', loginCheck, async ctx => {
	const res = await uploadImg(ctx.req);
	ctx.body = res;
});

export default router;
