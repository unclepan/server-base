/**
 * @description 路由 channel
 */

import Router from 'koa-router';

// 中间件
import loginCheck from '../middlewares/loginCheck';
import genValidator from '../middlewares/genValidator';
import channelSchema from '../validator/channel';

// controller
import controllerChannel from '../controller/channel/index';
const { createChannel, deleteChannel, updateChannelName, getWorkChannels } =
	controllerChannel;

// 路由前缀
const router = new Router({
	prefix: '/api/channel'
});

// 创建渠道
router.post('/', loginCheck, genValidator(channelSchema), async ctx => {
	const res = await createChannel(
		ctx.request.body as { workId: string; name: string }
	);
	ctx.body = res;
});

// 删除渠道
router.delete('/:id', loginCheck, async ctx => {
	const { id } = ctx.params;
	const res = await deleteChannel(id);
	ctx.body = res;
});

// 更新渠道名称
router.patch(
	'/updateName/:id',
	loginCheck,
	genValidator(channelSchema),
	async ctx => {
		const { id } = ctx.params;
		const { name } = ctx.request.body as {
			name: string;
		};
		const res = await updateChannelName(id, name);
		ctx.body = res;
	}
);

// 根据一个作品的所有渠道
router.get('/getWorkChannels/:workId', loginCheck, async ctx => {
	const { workId } = ctx.params;
	const res = await getWorkChannels(workId);
	ctx.body = res;
});

export default router;
