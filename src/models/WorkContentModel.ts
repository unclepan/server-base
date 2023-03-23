/**
 * @description 作品内容 Model ，存储到 Mongodb
 */

import mongo from '../db/mongoose';
const { Schema, model } = mongo;

// 两个 model 公用一个 schema
const contentSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		// 页面的组件列表
		components: {
			type: [Object]
		},
		// 页面的属性，如页面背景图片
		props: {
			type: Object
		},
		// 配置信息，如微信分享配置
		setting: {
			type: Object
		}
	},
	{ timestamps: true }
);

// 未发布的内容
const WorkContentModel = model('workContent', contentSchema);

// 发布的内容
const WorkPublishContentModel = model('workPublishContent', contentSchema);

export default {
	WorkContentModel,
	WorkPublishContentModel
};
