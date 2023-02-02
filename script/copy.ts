import * as shell from 'shelljs';
shell.cp('-R', 'package.json', './dist/package.json');
shell.cp('-R', 'src/public', './dist/src/public');
shell.cp('-R', 'src/views', './dist/src/views');
shell.cp('-R', '.env', './dist/.env');
shell.sed(
	'-i',
	'PROJECT_STATUS=source',
	'PROJECT_STATUS=compile',
	'./dist/.env'
);
// shell.rm('-R', './dist/test');
