/**
 * @description res 错误信息配置
 */

import errorInfos from './error';
import validateInfos from './validate';
import usersInfos from './users';
import worksInfos from './works';
import utilsInfos from './utils';
import channelInfos from './channel';

export default {
	...errorInfos,
	...validateInfos,
	...usersInfos,
	...worksInfos,
	...utilsInfos,
	...channelInfos
};
