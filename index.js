
var unrtf = require('./unrtf');
var pyth = require('./pyth');

function noop() {}

function rtf2html(rtf, options, callback) {
	if (!callback) {
		callback = options;
		options = null;
	}

	rtf = '' + [rtf];
	options = options || {};
	callback = callback || noop;

	var engine = options.engine || rtf2html.defaultEngine;

	if (engine === 'pyth') {
		pyth(rtf, options, callback);
	} else if (engine === 'unrtf') {
		unrtf(rtf, options, callback);
	} else {
		callback(new Error('unrtf: Unknown engine, please specify "pyth" or "unrtf".'));
	}
}

rtf2html.defaultEngine = 'pyth';

module.exports = rtf2html;
