/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Alexander Merkulov @merqlove
 */

/**
 * Process Module ID.
 * @param {string} templateId Template ID.
 * @return {object} Module ID, New Template ID.
 */
module.exports = function (templateId, opts) {
    var root = '[root]';
    var sep = '/';
    var defaultName = 'ng';


    var moduleId = opts.module || defaultName;
    var newTemplateId = templateId;

    if (~moduleId.indexOf(root)) {
        var path = templateId.split(sep);
        var suffix = path.shift();
        moduleId = moduleId.replace(root, suffix);
        newTemplateId = path.join(sep);
    }

    return {
        moduleId: moduleId,
        templateId: newTemplateId
    };
};
