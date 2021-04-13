const fs = require('fs');
const path = require('path');
const objFunctions = require('./mdLinksFunctions.js');

const mdLinks = (archive, {validated, stats}={}) => {
	let validation = validated === true ? true : false;
	let stadistics = stats === true ? true : false;
	const extNamePath = path.extname(archive);
	fs.lstat(archive, (err, fsStat) => {
    if (err) {
			return console.log(err);
		} else {
			if (fsStat.isFile()){
			(extNamePath === '.md') ? (objFunctions.readDocMd(archive, validation, stadistics)) :(objFunctions.showArchivePath(archive));
			}  else if (fsStat.isDirectory()) {
				objFunctions.showArchivePath(archive);
				readDirectory(archive, validation, stadistics);
			}
		}
});
}

const readDirectory = (directory, validation, stadistics) => {
	fs.readdir(directory, (err, files) => {
		if (err) {
			return console.log(chalk.red.bold('Error al procesar el archivo'));
		}	else {
			files.forEach((doc) => {
				const newPath = path.normalize(directory + '/' + doc);
				mdLinks(newPath,  {validated: validation, stats: stadistics});
			}); 
		}
	});
}

module.exports= mdLinks;
