const extend = require("extend");
const htmlMinifier = require("html-minifier");
const scriptParser = require('./lib/scriptParser.js');
const urlParser = require('./lib/urlParser.js');
const getTemplateId = require('./lib/templateId.js');
const getModuleId = require('./lib/moduleId.js');

const { createFilter } = require("@rollup/pluginutils");

var PRE_STUB = 'var angular=window.angular,ngModule;\n' +
    'try {ngModule=angular.module(["${mod}"])}\n' +
    'catch(e){ngModule=angular.module("${mod}",[])}' +
    // added injector to load $templateCache for dynamic chunks    
    'var inj=angular.element(window.document).injector();\n';
;

var STUB = 'var v${i}=${val};\n' +
    'var id${i}="${key}";\n' +
    'if(inj){inj.get("$templateCache").put(id${i},v${i});}\n' +
    'else{ngModule.run(["$templateCache",function(c){c.put(id${i},v${i})}]);}';


/**
* Replaces placeholders with values.
* @param {string} stub Template ith placeholders.
* @param {Object} values Key-value pairs.
* @return {string} Resolved template.
*/
function supplant(stub, values) {
    return stub.replace(/\$\{([^}]+)\}/g, function (match, key) {
        return values[key] || match;
    });
}
/**
 * Replaces urls with `require(url)` for further processing with url-loader or file-loader.
 * @param {Object} query ng-cache-loader options.
 * @param {string} src Template text.
 * @return {string} JSON
 */
function resolveUrl(query, src) {
    return query.url === false ?
        JSON.stringify(src) :
        urlParser(src);
}



function ngcache(opts = {}) {
    if (!opts.include) {
        throw Error("include option should be specified");
    }

    const filter = createFilter(opts.include || '*.tpl.html', opts.exclude || 'node_modules/**');

    opts = extend(opts, {
        minimize: true,
        // next are html-minifier default options
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: false,
        removeEmptyAttributes: true,
        keepClosingSlash: true,
    });

    return {
        name: "ngcache",
        transform(code, id) {
            if (!filter(id)) {
                return
            }
            var minimizeOpts;
            var moduleId = 'ng';
            var result = [];
            var scripts;
            var html;
            var scr;
            var source = code;

            try {
                source = htmlMinifier.minify(code, extend({}, opts));
            } catch (e) {
                console.log('warning: ', e);
            }

            var scripts = scriptParser.parse('root', source, { scripts: [] }).scripts;
            source = Array.prototype.slice.apply(source);

            // Prepare named templates
            while (scripts.length) {
                scr = scripts.pop();
                html = source
                    .splice(scr.idx, scr.len)
                    .splice(scr.contIdx, scr.contLen)
                    .join('');

                try {
                    html = htmlMinifier.minify(html, extend({}, opts));
                } catch (e) {
                    console.log('warning: ', e);
                }

                if (scr.id) {
                    result.push({
                        key: scr.id,
                        val: resolveUrl(opts, html),
                        i: result.length + 1,
                    });
                } else {
                    source.splice(scr.idx, 0, html);
                }
            }
            // Prepare the ramaining templates (means w/o `script` tag or w/o `id` attribute)
            source = source.join('');

            if (/[^\s]/.test(source) || !result.length) {
                var templateId = getTemplateId.call(this, source, id, opts);
                var mod = getModuleId.call(this, templateId, opts);
                moduleId = mod.moduleId;
                result.push({
                    key: mod.templateId,
                    val: resolveUrl(opts, source),
                    i: result.length + 1,
                });
            }

            result = result.map(supplant.bind(null, STUB));
            result.push('export default v' + result.length + ';');
            result.unshift(supplant(PRE_STUB, { mod: moduleId }));
            source = result.join('\n');

            return {
                code: source,
                map: { mappings: "" },
            };
        },
    };
}

exports.ngcache = ngcache;
exports.default = ngcache; 