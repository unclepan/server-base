/**
 * @description API test - 按顺序挨个测试
 */

require('./db-check');
require('./users'); // 先测试 users 接口，以便获取登录权限
require('./works');
require('./template');
require('./channel');
