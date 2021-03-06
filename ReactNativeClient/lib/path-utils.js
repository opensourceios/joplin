const { _ } = require('lib/locale');

function dirname(path) {
	if (!path) throw new Error('Path is empty');
	let s = path.split(/\/|\\/);
	s.pop();
	return s.join('/');
}

function basename(path) {
	if (!path) throw new Error('Path is empty');
	let s = path.split(/\/|\\/);
	return s[s.length - 1];
}

function filename(path, includeDir = false) {
	if (!path) throw new Error('Path is empty');
	let output = includeDir ? path : basename(path);
	if (output.indexOf('.') < 0) return output;

	output = output.split('.');
	output.pop();
	return output.join('.');
}

function fileExtension(path) {
	if (!path) throw new Error('Path is empty');

	let output = path.split('.');
	if (output.length <= 1) return '';
	return output[output.length - 1];
}

function isHidden(path) {
	let b = basename(path);
	if (!b.length) throw new Error('Path empty or not a valid path: ' + path);
	return b[0] === '.';
}

function safeFileExtension(e) {
	if (!e || !e.replace) return '';
	return e.replace(/[^a-zA-Z0-9]/g, '')
}

function safeFilename(e, maxLength = null, allowSpaces = false) {
	if (maxLength === null) maxLength = 32;
	if (!e || !e.replace) return '';
	const regex = allowSpaces ? /[^a-zA-Z0-9\-_\(\)\. ]/g : /[^a-zA-Z0-9\-_\(\)\.]/g
	let output = e.replace(regex, '_')
	return output.substr(0, maxLength);
}

let friendlySafeFilename_blackListChars = '/<>:\'"\\|?*';
for (let i = 0; i < 32; i++) {
	friendlySafeFilename_blackListChars += String.fromCharCode(i);
}

const friendlySafeFilename_blackListNames = [".", "..", "CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9", "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"];

function friendlySafeFilename(e, maxLength = null) {
	if (maxLength === null) maxLength = 255;
	if (!e || !e.replace) return _('Untitled');
	
	let output = '';
	for (let i = 0; i < e.length; i++) {
		const c = e[i];
		if (friendlySafeFilename_blackListChars.indexOf(c) >= 0) {
			output += '_';
		} else {
			output += c;
		}
	}

	if (output.length <= 4) {
		if (friendlySafeFilename_blackListNames.indexOf(output.toUpperCase()) >= 0) {
			output = '___';
		}
	}

	while (output.length) {
		const c = output[output.length - 1];
		if (c === ' ' || c === '.') {
			output = output.substr(0, output.length - 1);
		} else {
			break;
		}
	}

	while (output.length) {
		const c = output[0];
		if (c === ' ') {
			output = output.substr(1, output.length - 1);
		} else {
			break;
		}
	}

	if (!output) return _('Untitled'); 

	return output.substr(0, maxLength);
}

function toSystemSlashes(path, os = null) {
	if (os === null) os = process.platform;
	if (os === 'win32') return path.replace(/\//g, "\\");
	return path.replace(/\\/g, "/");
}

function rtrimSlashes(path) {
	return path.replace(/[\/\\]+$/, '');
}

function ltrimSlashes(path) {
	return path.replace(/^\/+/, '');
}

module.exports = { basename, dirname, filename, isHidden, fileExtension, safeFilename, friendlySafeFilename, safeFileExtension, toSystemSlashes, rtrimSlashes, ltrimSlashes };