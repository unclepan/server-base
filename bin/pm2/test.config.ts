/**
 * @description pm2配置信息
 */

// import os from 'os';
import path from 'path';

// const cpuCoreLength = os.cpus().length; // CPU 几核
// 为了测试方便，pm2 进程设置为 1
const cpuCoreLength = 1;

const config = {
	name: 'server-base',
	script: path.join(__dirname, '../www.js'),
	// watch: true,
	ignore_watch: ['node_modules', '__test__', 'logs'],
	instances: cpuCoreLength,
	error_file: '../logs/err.log',
	out_file: '../logs/out.log',
	log_date_format: 'YYYY-MM-DD HH:mm:ss Z', // Z 表示使用当前时区的时间格式
	combine_logs: true, // 多个实例，合并日志
	max_memory_restart: '300M' // 内存占用超过 300M ，则重启
};

module.exports = {
	apps: [config]
};
