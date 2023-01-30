export default {
	type: 'object',
	// 用户信息要符合 ChannelModel 配置
	required: ['name'],
	properties: {
		name: {
			type: 'string',
			maxLength: 255
		},
		workId: {
			type: 'number'
		}
	}
};
