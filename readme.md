# unrtf

Converts RTF documents to HTML by calling the `unrtf` command line.


## Install

You need to install `unrtf` command line utility first, then:

```
npm install unrtf
```


## Example

```js
var unrtf = require('unrtf');

unrtf('{\\rtf1\\ansi\\ansicpg1252\\cocoartf1265\\cocoasubrtf210\n{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\paperw11900\\paperh16840\\margl1440\\margr1440\\vieww10800\\viewh8400\\viewkind0\n\\pard\\tx566\\tx1133\\tx1700\\tx2267\\tx2834\\tx3401\\tx3968\\tx4535\\tx5102\\tx5669\\tx6236\\tx6803\\pardirnatural\n\n\\f0\\fs24 \\cf0 Hello, World!\\\n\\\nThis is RTF. :-)}', { clean: true }, function(error, result) {
	console.log(result.html);
});
```


## API

> unrtf(doc, [options], callback)

### doc
Type: string (required)

The input RTF document you want to convert.

### options
Type: object (optional)

Two options are supported:

1. **clean**, if set to true it will clean up the resulting HTML code (default false)
2. **timeout**, set the timeout of calling the `unrtf` command in milliseconds (default 2000)

### callback
Type: function (required)

Invoked with the result or error, if any.


## License

The code for node-unrtf is licensed under the MIT license. See `license.txt` file for more info.
