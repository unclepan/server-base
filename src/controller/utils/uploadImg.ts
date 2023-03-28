/**
 * @description 上传图片
 */

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import formidable from 'formidable';
import util from '../../utils/util';
import resModelFailInfo from '../../res-model/failInfo/index';
import resModel from '../../res-model/index';
import uploadCOS from '../../vendor/uploadCOS';
import { IncomingMessage } from 'http';

const { isWindows } = util;
const { uploadImgFailInfo } = resModelFailInfo;
const { ErrorRes, SuccessRes } = resModel;

// windows 系统，临时存储文件的目录
const TMP_PATH_WINDOWS = 'tmp-files-windows';

const form = formidable({ multiples: true });

// windows 系统，处理 rename 报错
if (isWindows) {
	const tmpPath = path.resolve(__dirname, '..', '..', '..', TMP_PATH_WINDOWS);
	if (!fs.existsSync(tmpPath)) {
		fs.mkdirSync(tmpPath);
	}
	// eslint-disable-next-line
	// @ts-ignore
	form.uploadDir = TMP_PATH_WINDOWS;
}

/**
 * 给 fileName 加个后缀，防止重复。如 `a.png` 变为 `a-xxx.png`
 */
function addSuffixForFileName(fileName = '') {
	// 用随机数，做一个后缀
	const suffix = Math.random().toString().slice(-6);

	if (!fileName) return '';
	const lastPointIndex = fileName.lastIndexOf('.');
	if (lastPointIndex < 0) {
		// 文件名没有后缀名
		return `${fileName}-${suffix}`;
	}

	// 文件名有后缀名
	return `${fileName.slice(0, lastPointIndex)}-${suffix}${fileName.slice(
		lastPointIndex
	)}`;
}

/**
 * 通过 formidable 上传图片
 */
function uploadImgByFormidable(req: IncomingMessage) {
	const p = new Promise((resolve, reject) => {
		form.parse(req, async function upload(err, fields, files) {
			if (err) {
				reject(err);
			}

			// console.log('fields.....', fields) // formData 其他参数，格式如如 { bbb: '123', ccc: 'abc' }

			// 遍历所有图片，并上传
			const filesKeys = Object.keys(files);
			try {
				const links = await Promise.all(
					filesKeys.map(name => {
						const file = files[name] as unknown as {
							originalFilename: string;
							filepath: string;
						};

						let fileName = file.originalFilename || name;
						fileName = addSuffixForFileName(fileName); // 给 name 加个后缀，防止名称重复
						return uploadCOS(fileName, file.filepath);
					})
				);

				// 删除源文件
				_.forEach(files, file => {
					// eslint-disable-next-line
	                // @ts-ignore
					fs.unlinkSync(file.filepath);
				});
				// 返回结果
				resolve(links);
			} catch (ex) {
				reject(ex);
			}
		});
	});
	return p;
}

/**
 * 上传图片
 */
async function uploadImg(req: IncomingMessage) {
	let urls;
	try {
		urls = await uploadImgByFormidable(req);
	} catch (ex) {
		return new ErrorRes(uploadImgFailInfo);
	}

	return new SuccessRes({
		urls
	});
}

export default uploadImg;
