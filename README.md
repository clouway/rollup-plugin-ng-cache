# Angular Template loader for rollup

Puts HTML partials in the Angular's $templateCache so directives can use templates without initial downloading.

## Rollup Plugin

A [Plugin](https://rollupjs.org/guide/en/#plugins-overview) for Rollup that wrap content in the javascript code that executes in the browser. 
# Install

`npm install rollup-plugin-ng-cache`

# Usage

You can import plugin with:

```
import { ngcache } from 'rollup-plugin-ng-cache'
```

and register it with:

```
plugins([
  ngcache({ include: "**/*tpl.html", prefix: 'app:**', url: false }),
])

```

## Named templates

You can wrap template in the `script` tag:

``` html
<!-- ./demo/template/myPartial.html -->

<script type ="text/ng-template" id="myFirstTemplate">
  <!-- then use ng-include="'myFirstTemplate'" -->
</script>
```

You can have multiple templates in one file:

``` html
<!-- ./demo/template/myPartial.html -->

<script type ="text/ng-template" id="myFirstTemplate">
  <!-- then use ng-include="'myFirstTemplate'" -->
</script>

<script type ="text/ng-template" id="mySecondTemplate">
  <!-- then use ng-include="'mySecondTemplate'" -->
</script>
```

You can mix named templates and simple markup:

``` html
<!-- ./demo/template/myPartial.html -->

<script type ="text/ng-template" id="myFirstTemplate">
  <!-- then use ng-include="'myFirstTemplate'" -->
</script>

<!-- markup outside script tags available as ng-include="'myPartial.html'" -->
<div ng-include="'myFirstTemplate'">...</div>

<script type ="text/ng-template" id="mySecondTemplate">
  <!-- then use ng-include="'mySecondTemplate'" -->
</script>
```

## Root

You can specify root directory for templates separated by a colon `prefix=root:**`. 
It is enough to specify a single directory name. Prefix counts real template path from right to left and takes first (rightmost) occurance of the root directory.

```
/User/packman/Projects/packman/
  ├─ app/tmpls/field.html
  └─ components/skins/tmpls/yellow.html
```

With this directory tree you require templates from the inside of `app/tmpls` and `components/skins/tmpls`.

It is also possible to combine wildcards in prefix, i.e. `prefix=packman:**/tmpls//*`.


## Template id
 
To obtain template id use `exportIdOnly` query parameter. Loader exports `id` of a template.

```javascript
var template = require('ng-cache?exportIdOnly!./field.html')

$('#wrapper').html(`<div id="bootstrapElement" data-ng-include="'${template}'"></div>`);
angular.bootstrap($('#bootstrapElement'), [someModule]);
```

To obtain both template id and html partial use `exportId` query parameter. Loader exports object with `id` and `template` keys.

```javascript
var template = require('ng-cache?exportId!./field.html')

$('#wrapper').html(`<div id="bootstrapElement" data-ng-include="'${template.id}'"></div>`);
angular.bootstrap($('#bootstrapElement'), [someModule]);
```

## HTML minification

Minification is enabled by default. The [html-minifier](https://github.com/kangax/html-minifier) is used for templates minification with the default options:
```javascript
{
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: false,
    removeEmptyAttributes: true,
    keepClosingSlash: true
}
```

## URL resolve

Relative links to the local images are resolved by default (to prevent it use `-url` query param).

``` html
<!-- Source -->
<img src="../img/logo.png"></img>

<!-- becomes -->
<img src="data:image/png;base64,..."></img>
```

## Credits
This Plugin design was expired from: https://github.com/teux/ng-cache-loader

# License

MIT (http://www.opensource.org/licenses/mit-license.php)
