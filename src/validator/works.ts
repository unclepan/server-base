const workInfoSchema = {
	type: 'object',
	// 用户信息要符合 WorksModel 配置
	required: ['title'],
	properties: {
		title: {
			type: 'string',
			maxLength: 255
		},
		desc: {
			type: 'string',
			maxLength: 255
		},
		coverImg: {
			type: 'string',
			maxLength: 255
		},
		contentId: {
			type: 'string',
			maxLength: 255
		},

		// 作品内容 —— 这个并不在 WorksModel 中！！！
		content: {
			type: 'object',
			// 符合 WorkContentModel 属性规则
			properties: {
				_id: {
					type: 'string',
					maxLength: 255
				},
				components: {
					type: 'array'
				},
				props: {
					type: 'object'
				},
				setting: {
					type: 'object'
				}
			}
		}
	}
};

export default {
	workInfoSchema
};
