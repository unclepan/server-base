import * as shell from 'shelljs';
shell.cp('-R', 'package.json', './dist/package.json');
shell.cp('-R', 'src/public', './dist/src/public');
shell.cp('-R', 'src/views', './dist/src/views');
shell.rm('-R', './dist/test');
