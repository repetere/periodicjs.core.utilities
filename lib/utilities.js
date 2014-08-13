/*
 * periodic
 * http://github.com/typesettin/periodic
 *
 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 */

'use strict';

var fs = require('fs-extra'),
	path = require('path'),
	logger,
	appSettings;

/**
 * A module that represents a extension manager.
 * @{@link https://github.com/typesettin/periodic}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @module config
 * @requires module:fs
 * @requires module:util-extent
 * @throws {Error} If missing configuration files
 * @todo to do later
 */

var Utilities = function (resources) {
	logger = resources.logger;
	appSettings = resources.settings;
};

Utilities.isValidObjectID = function (str) {
	// coerce to string so the function can be generically used to test both strings and native objectIds created by the driver
	str = str + '';
	var len = str.length,
		valid = false;
	if (len === 12 || len === 24) {
		valid = /^[0-9a-fA-F]+$/.test(str);
	}
	return valid;
};

Utilities.run_cmd = function (cmd, args, callBack) {
	var spawn = require('child_process').spawn;
	var child = spawn(cmd, args);
	var resp = '';

	child.stdout.on('data', function (buffer) {
		resp += buffer.toString();
	});
	child.stdout.on('end', function () {
		callBack(resp);
	});
	//run_cmd( "ls", ["-l"], function(text) { console.log (text) });
};

Utilities.async_run_cmd = function (cmd, args, asynccallback, callback) {
	logger.silly('cmd', cmd);
	logger.silly('args', args);
	var spawn = require('child_process').spawn;
	var child = spawn(cmd, args);
	// var resp = '';

	child.stdout.on('error', function (err) {
		console.log('got error callback');
		callback(err, null);
	});
	child.stdout.on('data', function (buffer) {
		asynccallback(buffer.toString());
	});
	child.stderr.on('data', function (buffer) {
		asynccallback(buffer.toString());
	});
	//  child.stdout.on('end', function() {
	// console.log('got stdout end callback');
	// callback(null,"command run: "+cmd+" "+args);
	//  });
	//  child.stderr.on('end', function() {
	// console.log("got stderr end callback");
	// callback(null,"command run: "+cmd+" "+args);
	//  });
	child.on('exit', function () {
		logger.silly('got exit callback');
		callback(null, 'command run: ' + cmd + ' ' + args);
	}); //run_cmd( "ls", ["-l"], function(text) { console.log (text) });
};

Utilities.restart_app = function (options) {
	var d = new Date(),
		restartfile = (options.restartfile)? options.restartfile : path.join(process.cwd(), '/content/extensions/restart.json');

	logger.silly('application restarted');
	fs.outputFile(restartfile, 'restart log ' + d + '- \r\n ', function (err) {
		if (err) {
			logger.error(err);
		}
	});
};

Utilities.sortObject = function (dir, field) {
	var comparefunction;
	if (dir === 'desc') {
		comparefunction = function (a, b) {
			if (a[field] < b[field]) {
				return 1;
			}
			if (a[field] > b[field]) {
				return -1;
			}
			return 0;
		};
	}
	else {
		comparefunction = function (a, b) {
			if (a[field] < b[field]) {
				return -1;
			}
			if (a[field] > b[field]) {
				return 1;
			}
			return 0;
		};
	}

	return comparefunction;
};

Utilities.removeEmptyObjectValues = function (obj) {
	for (var property in obj) {
		if (typeof obj[property] === 'object') {
			this.removeEmptyObjectValues(obj[property]);
		}
		else {
			if (obj[property] === '' || obj[property] === ' ' || obj[property] === null || obj[property] === undefined || Object.keys(obj).length === 0) {
				delete obj[property];
			}
		}
	}
	return obj;
};

Utilities.removePrivateInfo = function (obj) {
	// console.log("removePrivateInfo obj",obj);
	if (typeof obj === 'object') {
		obj.password = null;
		obj.apikey = null;
		obj.random = null;
	}
	return obj;
};

Utilities.stripTags = function (textinput) {
	if (textinput) {
		return textinput.replace(/[^a-z0-9@._]/gi, '-').toLowerCase();
	}
	else {
		return false;
	}
};

Utilities.makeNiceName = function (username) {
	if (username) {
		return username.replace(/[^a-z0-9]/gi, '-').toLowerCase();
	}
	else {
		return false;
	}
};
Utilities.makeNiceAttribute = function (username) {
	if (username) {
		return username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
	}
	else {
		return false;
	}
};

module.exports = Utilities;