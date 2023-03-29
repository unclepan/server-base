/**
 * @description 上传文件到 oss
 */

import { createReadStream, ReadStream, statSync } from 'fs';
import { parse } from 'url';
import COS from 'cos-nodejs-sdk-v5';
import config from '../config';
const { SECRET_ID, SECRET_KEY, CDN_HOST } = config.tencentCloudConf;

// 初始化 oss 实例
const cos = new COS({
	SecretId: SECRET_ID, // 推荐使用环境变量获取；用户的 SecretId，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
	SecretKey: SECRET_KEY // 推荐使用环境变量获取；用户的 SecretKey，建议使用子账号密钥，授权遵循最小权限指引，降低使用风险。子账号密钥获取可参考https://cloud.tencent.com/document/product/598/37140
});

function putObject(
	bucket: string,
	region: string,
	filename: string,
	body: ReadStream,
	contentLength: number,
	headers = {}
) {
	return new Promise((resolve, reject) => {
		cos.putObject(
			{
				Bucket: bucket /* 必须 */,
				Region: region,
				Key: filename /* 必须 */,
				onProgress: function (progressData) {
					console.log(JSON.stringify(progressData));
				},
				// 格式1. 传入文件内容
				// Body: fs.readFileSync(filepath),
				// 格式2. 传入文件流，必须需要传文件大小
				Body: body,
				ContentLength: contentLength,
				Headers: headers
			},
			function (err, data) {
				if (err) {
					// 失败
					reject(err);
					return;
				}
				resolve(data);
			}
		);
	});
}

/**
 * 替换url的host为CDNhost
 */
function replaceCDNHost(u = '') {
	if (!u) return u;
	const res = parse(u);

	let { protocol } = res;
	if (process.env.NODE_ENV === 'production' || !protocol) protocol = 'https:'; // 线上环境，强行 https

	const { path } = res;
	const u1 = `${protocol}//${CDN_HOST}${path}`; // 替换 CDN host
	return u1;
}

/**
 * 上传文件到 oss
 */
async function uploadCOS(fileName: string, filePath: string) {
	const stream = createReadStream(filePath);
	const size = statSync(filePath).size;
	try {
		// 使用 stream 上传，效率高
		const res = (await putObject(
			'base-1252254586',
			'ap-hongkong',
			fileName,
			stream,
			size
		)) as {
			Location: string;
		};
		return replaceCDNHost(res.Location);
	} catch (ex) {
		// TODO 报警
		throw new Error('腾讯云COS上传错误');
	}
}

export default uploadCOS;
