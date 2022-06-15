const concurrently = require("concurrently")
const pkg = require("../package.json")

const n = pkg.name

const {result} = concurrently([
        {
            command: `npm:dev -w server`,
            name: 'dev-server',
            prefixColor: 'inverse.cyan'
        },
        {
            command: `npm:dev -w app`,
            name: 'dev-app',
            prefixColor: 'inverse.yellow'

        },
    ],
);
result.catch(e => console.error(e))
