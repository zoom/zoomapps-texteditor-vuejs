const concurrently = require('concurrently');
const pkg = require('../package.json');
const fs = require('fs-extra');
const { exec } = require('child_process');

const name = pkg.name;

const outDir = './dist';
fs.ensureDir(outDir)

fs.copy('package-lock.json', `${outDir}/package-lock.json`);
fs.copy('server/package.json', `${outDir}/package.json`);
fs.copy('server/src/views', `${outDir}/views`);


exec(`npm --prefix ${outDir} install ${outDir}`);
exec('npm run dev -ws');

const { result } = concurrently([
        {
            command: `APP_NAME='${name}' DEBUG='${name}:' npm run dev -w server`,
            name: 'dev-server',
            prefixColor: 'inverse.cyan',
        },
        {
            command: `npm:dev -w app`,
            name: 'dev-app',
            prefixColor: 'inverse.yellow',

        },
    ],
);
result.catch(e => console.error(e));
