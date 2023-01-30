/**
 * @description 作品内容 Model，存储到 Mongodb
 */
import mongo from '../db/mongoose';
const { Schema, model } = mongo;

const WorkSchema = new Schema(
	{
		__v: {
			type: Number,
			select: false
		},
		// 标题
		title: {
			type: String
		},

		// 页面的组件列表
		components: {
			type: [Object]
		},
		// 页面的属性，保证扩展性
		props: {
			type: Object
		},
		// 配置信息，保证扩展性
		setting: {
			type: Object
		}
	},
	{ timestamps: true }
);

export default model('work', WorkSchema);
