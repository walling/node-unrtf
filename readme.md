# unrtf

Converts RTF documents to HTML. It features two engines that performs a bit differently, so you might try both on your RTF data.


## Install

By default the only prerequisite is to install Python. Then install this module:

```
npm install unrtf
```


## Example

```js
var unrtf = require('unrtf');

unrtf(
  '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1265\\cocoasubrtf210\n{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\paperw11900\\paperh16840\\margl1440\\margr1440\\vieww10800\\viewh8400\\viewkind0\n\\pard\\tx566\\tx1133\\tx1700\\tx2267\\tx2834\\tx3401\\tx3968\\tx4535\\tx5102\\tx5669\\tx6236\\tx6803\\pardirnatural\n\n\\f0\\fs24 \\cf0 Hello, World!\\\n\\\nThis is RTF. :-)}',
  function(error, result) {
    console.log(result.html);
  }
);
```


## API

> unrtf(doc, [options], callback)

### doc
Type: string (required)

The input RTF document you want to convert.

### options
Type: object (optional)

Two options are supported:

1. **engine**, choose the RTF converter engine, either "pyth" (default) or "unrtf"
2. **unclean**, if set to true it will not try to clean up the resulting HTML code, only applies to `unrtf` engine (default false)
3. **timeout**, set the timeout of calling the `unrtf` command in milliseconds (default 2000)

### callback
Type: function (required)

Invoked with the result or error, if any.


## Engines

You can choose between two engines:

 1. "pyth" (default), depends on Python being installed on your system
 2. "unrtf", depends on a command line utility

If you want to use the unrtf engine, you need to first install the utility:

 -  Mac: `brew install unrtf`
 -  Ubuntu: `aptitude install unrtf`
 -  Windows: [find the Windows installer here](http://gnuwin32.sourceforge.net/packages/unrtf.htm)

You can set the default engine:

```javascript
var unrtf = require('unrtf');

unrtf.defaultEngine = 'unrtf';
```


## License

The code for node-unrtf is licensed under the MIT license. See `license.txt` file for more info.
