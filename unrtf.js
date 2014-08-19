
var spawn = require('child_process').spawn;
var he = require('he');

function noop() {}

function unrtf(doc, options, callback) {
	if (!doc) return callback(null, { html: '' });

	if (!callback) {
		callback = options;
		options = null;
	}

	options = options || {};
	var timeout = options.timeout | 0 || 2000; // default 2 seconds
	var unclean = !!options.unclean;

	var child = spawn('unrtf', { env: { PATH: process.env.PATH } });

	var stdout = '';
	var stderr = '';
	var timer;

	child.stdout.setEncoding('utf8');
	child.stdout.on('data', function(data) {
		stdout += data;
	});

	child.stderr.setEncoding('utf8');
	child.stderr.on('data', function(data) {
		stderr += data;
	});

	child.on('close', function(code, signal) {
		clearTimeout(timer);
		if (code) {
			callback(new Error(
				'unrtf (exit code ' + code +
				(signal ? ', killed by signal ' + signal : '') +
				'): ' + stderr.trim()
			));
		} else {
			var html = he.decode(stdout.trim());

			if (!unclean) {
				html = html
					.replace(/^[\s\S]* -->/, '') // remove everything until unrtf version - hack
					.replace(/^[\s\S]*<body.*?>/, '') // remove everything until body tag
					.replace(/<\/body.*?>[\s\S]*$/, '') // remove everything after body tag
					.replace(/<\/?font.*?>/g, '') // remove font tags
					.replace(/<\/?span.*?>/g, '') // remove span tags
					.replace(/>\s+/g, '>') // remove extra spaces
					.replace(/\s+</g, '<') // remove extra spaces
					// .replace(/<br>\u00B7\s+([^<]*)/g, '<ul><li>$1</li></ul>') // try re-creating lists
					// .replace(/<\/ul>(<br>)?<ul>/g, '') // lists cleanup
					.replace(/\s+/g, ' ') // merge multiple spaces
					.trim();
			}

			callback(null, {
				html: html,
				warnings: stderr.trim() || null
			});
		}
		callback = noop;
	});

	timer = setTimeout(function() {
		callback(new Error('unrtf: Timeout after ' + timeout + ' milliseconds'));
		callback = noop;
	}, timeout);

	child.stdin.end('' + doc);
}

module.exports = unrtf;
