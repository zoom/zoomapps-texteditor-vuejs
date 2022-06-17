import fse from 'fs-extra';

import spawn from 'await-spawn';

export const shell = async (cmd, opts) =>
    spawn(cmd, opts, { stdio: 'inherit' });

export const init = async (outDir) => {
    fse.ensureDir(outDir);

    try {
        fse.copy('package-lock.json', `${outDir}/package-lock.json`);
        fse.copy('server/package.json', `${outDir}/package.json`);
        fse.copy('server/src/views', `${outDir}/views`);
    } catch (e) {
        console.error(e);
    }
};
