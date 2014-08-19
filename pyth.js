
var events = require('events');
var spawn = require('child_process').spawn;
var split = require('split');
var path = require('path');
var util = require('util');

var rtf2htmlPythonScript = path.join(__dirname, 'rtf2html.py');

function Processor() {
	events.EventEmitter.call(this);
	this.killTimer = null;
	this.child = null;
	this.tasks = [];
}
util.inherits(Processor, events.EventEmitter);

Processor.prototype.waitToKill = function() {
	var self = this;

	if (self.killTimer) {
		clearTimeout(self.killTimer);
	}

	self.killTimer = setTimeout(function() {
		self.kill();
	}, 2000);
};

Processor.prototype.kill = function ProcessorKill() {
	var self = this;

	if (self.killTimer) {
		clearTimeout(self.killTimer);
		self.killTimer = null;
	}

	if (self.child) {
		self.child.kill();
		self.child = null;
	}
};

Processor.prototype.addTask = function ProcessorAddTask(rtf, callback) {
	var self = this;

	if (self.child) {
		self.waitToKill();
	} else {
		self.respawn();
	}

	var task = [rtf, callback];
	self.tasks.push(task);
	self._addTask(task);
};

Processor.prototype._addTask = function ProcessorInternalAddTask(task) {
	var self = this;

	self.child.stdin.write(JSON.stringify(task[0]) + '\n');
};

Processor.prototype.respawn = function ProcessorRespawn() {
	var self = this;

	self.kill();

	var child = spawn('python', [rtf2htmlPythonScript], {
		env: { PATH: process.env.PATH }
	});
	self.child = child;

	child.stdin.on('error', function(error) {
		self.emit('error', error);
	});

	child.stdout.pipe(split())
		.on('data', function(line) {
			if (!line) return;

			var obj;
			try {
				obj = JSON.parse(line);
			} catch (error) {
				return self.emit('error', error);
			}

			var task = self.tasks.shift();
			if (task) {
				var callback = task[1];
				if (obj.error) {
					callback(new Error('unrtf: ' + obj.error));
				} else {
					callback(null, obj);
				}
			} else {
				self.emit('error', new Error('Got result without any active tasks'));
			}
		})
		.on('error', function(error) {
			self.emit('error', error);
		});

	child.stderr.pipe(split())
		.on('data', function(line) {
			line = ('' + line).replace(/\s+$/, '');
			if (line) {
				console.error('unrtf: ' + line);
			}
		})
		.on('error', function(error) {
			self.emit('error', error);
		});

	self.tasks.forEach(function(task) {
		self._addTask(task);
	});

	self.waitToKill();

	return self;
};

var processor = new Processor();

processor.on('error', function(error) {
	console.error('unrtf:', error);
	processor.respawn();
});

function noop() {}

function pyth(rtf, options, callback) {
	if (!callback) {
		callback = options;
		options = null;
	}

	callback = callback || noop;
	if (!rtf) return callback(null, { html: '' });

	// Encode Unicode characters as RTF commands, fixes encoding issue in Pyth library.
	rtf = ('' + [rtf]).replace(/[\u0080-\uFFFF]/g, function(ch) {
		var code = ch.charCodeAt(0);
		if (code > 32767) code -= 65536;
		return '\\uc1\\u' + code + '?';
	});

	processor.addTask(rtf, function(error, result) {
		if (error) {
			callback(error);
		} else {
			var html = '' + result.html;

			if (/^<div>/.test(html) && /<\/div>$/.test(html)) {
				html = html.slice(5,-6);
			}

			callback(null, { html: html });
		}
		callback = noop;
	});
}

module.exports = pyth;
