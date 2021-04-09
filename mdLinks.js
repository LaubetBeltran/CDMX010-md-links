const fs = require('fs');
const path = require('path');
const objFunctions = require('./mdLinksFunctions.js');

const mdLinks = (archive, validation, stadistics) => {
	const extNamePath = path.extname(archive);
	fs.lstat(archive, (err, stats) => {
    if (err) {
			return console.log(err);
		} else {
			if (stats.isFile()){
			(extNamePath === '.md') ? (objFunctions.readDocMd(archive, validation, stadistics)) :(objFunctions.showArchivePath(archive));
			}  else if (stats.isDirectory()) {
				objFunctions.showArchivePath(archive);
				objFunctions.readDirectory(archive, validation, stadistics);
			}
		}
});
}

module.exports= mdLinks;
