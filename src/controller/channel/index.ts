/**
 * @description controller channel
 */

import serviceChannel from '../../service/channel';
import resModelFailInfo from '../../res-model/failInfo/index';
import resModel from '../../res-model/index';
const { createChannelService, updateChannelService, findChannelsService } =
	serviceChannel;
const { ErrorRes, SuccessRes } = resModel;
const {
	createChannelFailInfo,
	createChannelDbErrorFailInfo,
	updateChannelFailInfo,
	updateChannelDbErrorFailInfo,
	findChannelListFailInfo
} = resModelFailInfo;

/**
 * 创建渠道
 */
async function createChannel(data: { workId: string; name: string }) {
	const { workId, name } = data;
	if (!workId || !name)
		return new ErrorRes(createChannelFailInfo, '渠道标题和作品 id 不能为空');

	let result;
	try {
		result = await createChannelService(data);
	} catch (ex) {
		console.error('创建渠道错误', ex);
		return new ErrorRes(createChannelDbErrorFailInfo);
	}

	if (result == null) return new ErrorRes(createChannelFailInfo);
	return new SuccessRes(result);
}

/**
 * 删除渠道
 */
async function deleteChannel(id: string) {
	if (!id) return new ErrorRes(updateChannelFailInfo, 'id 不能为空');

	let result;
	try {
		result = await updateChannelService(
			{
				status: 0 // 假删除，实际更新 status
			},
			{
				id
			}
		);
	} catch (ex) {
		console.error('删除渠道错误', ex);
		return new ErrorRes(updateChannelDbErrorFailInfo);
	}

	if (result) return new SuccessRes(); // 成功
	return new ErrorRes(updateChannelFailInfo);
}

/**
 * 更新渠道
 */
async function updateChannelName(id: string, name: string) {
	if (!id || !name)
		return new ErrorRes(updateChannelFailInfo, 'id 和名称不能为空');

	let result;
	try {
		result = await updateChannelService({ name }, { id });
	} catch (ex) {
		console.error('更新渠道错误', ex);
		return new ErrorRes(updateChannelDbErrorFailInfo);
	}

	if (result) return new SuccessRes(); // 成功
	return new ErrorRes(updateChannelFailInfo);
}

/**
 * 获取作品的渠道列表
 */
async function getWorkChannels(workId: string) {
	if (!workId)
		return new ErrorRes(findChannelListFailInfo, 'id 和名称不能为空');

	const result = await findChannelsService({
		workId
	});

	return new SuccessRes(result);
}

export default {
	createChannel,
	deleteChannel,
	updateChannelName,
	getWorkChannels
};
