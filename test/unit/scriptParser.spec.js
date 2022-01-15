var expect = require('chai').expect;
var path = require('path');
const htmlMinifier = require("html-minifier");

var cwd = process.cwd();

const scriptParser = require(path.join(cwd, 'lib/scriptParser'));

const minifyOptions = {
    minimize: true,
    // next are html-minifier default options
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: false,
    removeEmptyAttributes: true,
    keepClosingSlash: true,
}

describe('scriptParser', () => {
    it('parses chunked html content', () => {
        var code = `
        <script type ="text/ng-template" id="myTemplate">
            <div class="view">
                <h2>First View</h2>
                <p>Search:<input type="text" ng-model="filterText" /></p>
            </div>
        </script>

        <div class="view">
            <h2>Second View</h2>
            <p>About me</p>
        </div>

        <script type="text/ng-template" id="myAnotherTemplate">
            <div class="view">
                <p>...</p>
            </div>
        </script>

        <div class="view">
            <h2>Second View</h2>
            <p>About you</p>
        </div>

        <script type="text/ng-template">
            <div class="view"></div>
        </script>
        `

        code = htmlMinifier.minify(code, minifyOptions);


        var scripts = scriptParser.parse('root', code, { scripts: [] }).scripts;
        var source = Array.prototype.slice.apply(code);
        var result = [];
        console.log('scripts: ', scripts.length);
        // Prepare named templates
        while (scripts.length) {
            scr = scripts.pop();
            var html = source
                .splice(scr.idx, scr.len)
                .splice(scr.contIdx, scr.contLen)
                .join('');
            html = htmlMinifier.minify(html, minifyOptions);

            if (scr.id) {
                result.push({
                    key: scr.id,
                    val: JSON.stringify(html),
                    i: result.length + 1,
                });
            } else {
                source.splice(scr.idx, 0, html);
            }

        }
        // Prepare the ramaining templates (means w/o `script` tag or w/o `id` attribute)
        source = source.join('');
        console.log(result)

    })
})

function parseCode(source) {
    return {

    }
}