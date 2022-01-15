'use strict';
require('jsdom-global')()


/*
 * Since angular and angular-mocks are both singletons created once with one window-object
 * and mocha doesn't reload modules from node_modules on watch mode we'll have to
 * invalidate the cached singletons manually.
 */

delete require.cache[require.resolve('angular')];
delete require.cache[require.resolve('angular/angular')];
delete require.cache[require.resolve('angular-mocks')];

require('angular/angular');
require('angular-mocks');


var $injector = window.angular.injector(['ng']);

module.exports = {
    inject: $injector.invoke,
    module: window.angular.mock.module
};