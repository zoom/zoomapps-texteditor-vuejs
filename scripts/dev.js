import concurrently from 'concurrently';
import {init, shell} from './common.js';
import fs from 'fs';

const outDir = './dist'

// Configure our server environment variables for darwin/linux and win32
let command = `npm run dev -w server`;

if (process.platform === 'win32')
    command = `set "DEBUG=zoomapps*" & ${command}`;
else command = `DEBUG="zoomapps*" ${command}`;

await init(outDir)

if (!fs.existsSync(`${outDir}/node_modules`))
    await shell('npm', ['--prefix', outDir, 'install']);

const { result } = concurrently([
    {
        command,
        name: 'dev-server',
        prefixColor: 'inverse.cyan',
    },
    {
        command: `npm:dev -w app`,
        name: 'dev-app',
        prefixColor: 'inverse.yellow',
    },
]);

result.catch((e) => console.error(e));
