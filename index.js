
var unrtf = require('./unrtf');

function noop() {}

function unrtf(rtf, options, callback) {
	if (!callback) {
		callback = options;
		options = null;
	}

	rtf = '' + [rtf];
	options = options || {};
	callback = callback || noop;

	var engine = options.engine || unrtf.defaultEngine;

	if (engine === 'unrtf') {
		unrtf(rtf, options, callback);
	} else {
		callback(new Error('unrtf: Unknown engine, please specify "unrtf".'));
	}
}

unrtf.defaultEngine = 'unrtf';

module.exports = unrtf;
