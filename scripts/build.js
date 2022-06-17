import fse from 'fs-extra'
import {init, shell} from './common.js';

const out = './dist';

try {
    fse.emptydir(out);

    await shell('npm', ['run', 'build', '-ws']);

    await init(out);
    fse.copy('./app/dist', './dist/public');
} catch (e) {
    console.error(e);
}
