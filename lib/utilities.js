/*
 * periodic
 * http://github.com/typesettin/periodic
 *
 * Copyright (c) 2014 Yaw Joseph Etse. All rights reserved.
 */

'use strict';

var fs = require('fs-extra'),
	merge = require('utils-merge'),
	path = require('path'),
	logger,
	appSettings;

/**
 * A group of utility functions for restarting periodic's express application and helper functions to manipulate strings and other data structures.
 * @{@link https://github.com/typesettin/periodicjs.core.utilities}
 * @author Yaw Joseph Etse
 * @copyright Copyright (c) 2014 Typesettin. All rights reserved.
 * @license MIT
 * @constructor
 * @requires module:fs
 * @requires module:util-merge
 * @requires module:path
 */
var Utilities = function (resources) {
	logger = resources.logger;
	appSettings = resources.settings;
};

/**
 * simple helper function for validating mongo object IDs
 * @param  {string}  str mongo object id
 * @return {Boolean}     [description]
 */
Utilities.prototype.isValidObjectID = function (str) {
	// coerce to string so the function can be generically used to test both strings and native objectIds created by the driver
	str = str + '';
	var len = str.length,
		valid = false;
	if (len === 12 || len === 24) {
		valid = /^[0-9a-fA-F]+$/.test(str);
	}
	return valid;
};

/**
 * shorthand method for running shell commands
 * @param  {string} cmd      shell command
 * @param  {array} args     command line arguments
 * @param  {function} callBack async callback
 * @return {function}          callback(response)
 */
Utilities.prototype.run_cmd = function (cmd, args, callBack) {
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

/**
 * shorthand method for running shell commands
 * @param  {string} cmd      shell command
 * @param  {array} args     command line arguments
 * @param  {function} asynccallback async callback
 * @param  {function} callBack  callback
 * @return {function}          callback(response)
 */
Utilities.prototype.async_run_cmd = function (cmd, args, asynccallback, callback) {
	//logger.silly('cmd', cmd);
	//logger.silly('args', args);
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
		if(logger){
			logger.silly('got exit callback');
		}
		callback(null, 'command run: ' + cmd + ' ' + args);
	}); //run_cmd( "ls", ["-l"], function(text) { console.log (text) });
};

/**
 * shorthand method for restarting periodic by updating the node script's watch file content/config/restart.json
 * @param  {object} options restartfile - define a custom restart file
 */
Utilities.prototype.restart_app = function (options) {
	var d = new Date(),
		restartfile = (typeof options === 'object' && options.restartfile)? options.restartfile : path.join(process.cwd(), '/content/config/restart.json'),
		callback = options.callback;

	if(logger){
		logger.silly('application restarted');
	}
	fs.outputFile(restartfile, 'restart log ' + d + '- \r\n ', function (err) {
			if (err) {
				if(logger){
					logger.silly('application restarted');
				}
				else{
					console.error(err);
				}
			}
			if(callback){
				callback(err,'application started');
			}	
	});
};

/**
 * custom object sort by field
 * @example
 * 			req.controllerData.searchdocuments = searchdocuments.sort(CoreUtilities.sortObject('desc', 'createdat'));
 * @param  {string} dir   either asc or desc
 * @param  {string} field object property to seach
 * @return {function}  object sort compare function
 */
Utilities.prototype.sortObject = function (dir, field) {
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

/**
 * remove empty object properties that have empty values
 * @param  {object} obj object to remove empty fields from
 * @return {object}     object with empty values removed
 */
Utilities.prototype.removeEmptyObjectValues = function (obj) {
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

/**
 * replace boolean strings with actual boolean values
 * @example
 *  updatedThemeSettings = CoreUtilities.replaceBooleanStringObjectValues(updatedThemeSettings);
 * @param  {object} obj object to substitute values
 * @return {object}     object with boolean values
 */
Utilities.prototype.replaceBooleanStringObjectValues = function (obj) {
	for (var property in obj) {
		if (typeof obj[property] === 'object') {
			this.replaceBooleanStringObjectValues(obj[property]);
		}
		else {
			if(obj[property] === 'true'){
				obj[property] = true;
			}
			else if(obj[property] === 'false'){
				obj[property] = false;
			}
		}
	}
	return obj;
};

/**
 * remove private data from user objects
 * @param  {object} obj user object
 * @return {object}     object with removed private data
 */
Utilities.prototype.removePrivateInfo = function (obj) {
	// console.log("removePrivateInfo obj",obj);
	if (typeof obj === 'object') {
		obj.password = null;
		obj.apikey = null;
		obj.random = null;
	}
	return obj;
};

/**
 * replace all non alpha numeric tags with dashes and lowercase
 * @param  {string} textinput string to manipulate
 * @return {string}           manipulated string
 */
Utilities.prototype.stripTags = function (textinput) {
	if (textinput) {
		return textinput.replace(/[^a-z0-9@._]/gi, '-').toLowerCase();
	}
	else {
		return false;
	}
};

/**
 * replace all non alpha numeric tags with dashes and lowercase
 * @param  {string} username string to manipulate
 * @return {string}           manipulated string
 */
Utilities.prototype.makeNiceName = function (username) {
	if (username) {
		return username.replace(/[^a-z0-9]/gi, '-').toLowerCase();
	}
	else {
		return false;
	}
};

/**
 * replace all non alpha numeric tags with dashes and lowercase
 * @param  {string} username string to manipulate
 * @return {string}           manipulated string
 */
Utilities.prototype.makeNiceAttribute = function (username) {
	if (username) {
		return username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
	}
	else {
		return false;
	}
};

/**
 * add additional admin interface items from periodic extensions
 * @param  {object} options config options
 * @return {object}         admin menu json object
 */
Utilities.prototype.getAdminMenu = function (options) {
	var adminmenu = {
		menu: {
			Global: {},
			Content: {},
			Themes: {},
			Extensions: {},
			Settings: {},
			User: {}
		}
	};
	if(logger && logger.silly && options){
		logger.silly(options);
	}
	for (var x in appSettings.extconf.extensions) {
		if (appSettings.extconf.extensions[x].enabled === true && appSettings.extconf.extensions[x].periodicConfig['periodicjs.ext.admin']) {
			var extmenudata = appSettings.extconf.extensions[x].periodicConfig['periodicjs.ext.admin'];
			// console.log("before adminmenu",adminmenu);
			if (extmenudata.menu.Global) {
				adminmenu.menu.Global = merge(extmenudata.menu.Global, adminmenu.menu.Global);
			}
			if (extmenudata.menu.Content) {
				adminmenu.menu.Content = merge(extmenudata.menu.Content, adminmenu.menu.Content);
			}
			if (extmenudata.menu.Themes) {
				adminmenu.menu.Themes = merge(extmenudata.menu.Themes, adminmenu.menu.Themes);
			}
			if (extmenudata.menu.Extensions) {
				adminmenu.menu.Extensions = merge(extmenudata.menu.Extensions, adminmenu.menu.Extensions);
			}
			if (extmenudata.menu.Settings) {
				adminmenu.menu.Settings = merge(extmenudata.menu.Settings, adminmenu.menu.Settings);
			}
			if (extmenudata.menu.User) {
				adminmenu.menu.User = merge(extmenudata.menu.User, adminmenu.menu.User);
			}
			// console.log("after adminmenu",adminmenu);
		}
	}
	return adminmenu;
};

module.exports = Utilities;