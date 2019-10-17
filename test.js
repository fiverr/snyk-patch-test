const { promises: { readFile } } = require('fs');
const { resolve } = require('path');

let original;
let dependency;
let patch;
let lines;

describe('Snyk patch test', () => {
    before(async() => {

        /**
         * Actual dependency file contents
         * @type string
         */
        dependency = (await readFile(
            require.resolve('https-proxy-agent')
        )).toString();

        /**
         * Vulnerable tag 2.2.1 file - downloaded from Github
         * @type string
         */
        original = (await readFile(
            resolve(__dirname, 'fixtures/https-proxy-agent.js')
        )).toString();

        /**
         * Relevant chunk (addressing index.js) from patch file - downloaded from Snyk repository (S3)
         * @type string
         */
        patch = (await readFile(
            resolve(__dirname, 'fixtures/https-proxy-agent.patch')
        )).toString().split('diff').find((chunk) => chunk.includes('a/index.js b/index.js'));

        /**
         * Lines to remove and lines to add
         * @type Object
         * @member remove {string[]} vulnerable lines to remove
         * @member add    {string[]} fix lines to add
         */
        lines = patch.split('\n').reduce(
            ({ remove, add }, line) => {
                line.startsWith('- ') && remove.push(line.replace(/-\s*/, ''));
                line.startsWith('+ ') && add.push(line.replace(/\+\s*/, ''));

                return { remove, add };
            },
            { remove: [], add: [] }
        );
    });

    it('Change index file of "https-proxy-agent"', async() => {
        if (dependency === original) {
            throw new Error('The file https-proxy-agent/index.js is identical to original.');
        }
    });

    it('Should apply snyk patch for "https-proxy-agent"', async() => {
        const { remove, add } = lines;
        const messages = [];

        remove.forEach(
            (line) => dependency.includes(line) && messages.push(`Should not include vulnerable code: "${line}"`)
        );

        add.forEach(
            (line) => dependency.includes(line) || messages.push(`Should include fix code: "${line}"`)
        );

        if (messages.length) {
            throw new Error(`${messages.length}/${remove.length + add.length} line errors. ${messages.map((message) => `\n- ${message}`)}`);
        }
    });
});
