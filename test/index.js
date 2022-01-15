const helper = require('./test-helper')
const assert = require("assert");
const { rollup } = require("rollup");
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { ngcache } = require("../index");
const commonjs = require('@rollup/plugin-commonjs');

process.chdir("test");

describe("rollup-plugin-ng-cache", () => {
    it("should embed template as string", async () => {
        const bundle = await rollup({
            input: 'fixtures/basic.js',
            plugins: [
                commonjs(),
                nodeResolve({ browser: true }),
                ngcache({ include: "**/*tpl.html", prefix: 'test:**', url: false }),
            ],
        });
        const code = await getCode(bundle, undefined, false);
        new Function("assert", code)(assert);
    });

    it("should render mulitple scripts", async () => {
        const bundle = await rollup({
            input: 'fixtures/scripts.js',
            plugins: [
                commonjs(),
                nodeResolve({ browser: true }),
                ngcache({ include: "**/*tpl.html", prefix: 'test:**', url: false }),
            ],
        });
        const code = await getCode(bundle, undefined, false);
        new Function("assert", code)(assert);
    });
})

const getCode = async (bundle, outputOptions, allFiles = false) => {
    const { output } = await bundle.generate(outputOptions || { format: 'iife', exports: 'auto' });

    if (allFiles) {
        return output.map(({ code, fileName, source, map }) => {
            return { code, fileName, source, map };
        });
    }
    const [{ code }] = output;
    return code;
};
