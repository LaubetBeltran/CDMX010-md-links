const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const objFunctions = require('./mdLinksFunctions.js');
const showFunctions = require('./showCliFunctions.js');

const mdLinks = (archive, {validated}={}) => {
	return new Promise((resolve,reject) => {
		let validation = validated === true ? true : false;
		const extNamePath = path.extname(archive);
		fs.lstat(archive, (err, fsStat) => {
			if (err) {
				return console.log(err);
			} else {
				if (fsStat.isFile()){
					if(extNamePath === '.md'){ 
					objFunctions.readDocMd(archive, validation)
						.then((arrInfoLinksObjects)=> resolve(arrInfoLinksObjects))
						.catch((error) => reject(error))
					}
				} else if (fsStat.isDirectory()) {
					showFunctions.showArchivePath(archive);
					resolve(readDirectory(archive, validation))
				} else {(showFunctions.showArchivePath(archive))};
			}
		});
	});
}

const readDirectory = (directory, validation) => {
	fs.readdir(directory, (err, files) => {
		if (err) {
			return console.log(chalk.red.bold('Error al procesar el archivo'));
		}	else {
			files.forEach((doc) => {
				const newPath = path.normalize(directory + '/' + doc);
				mdLinks(newPath, {validated: validation});
			}); 
		}
	});
}

module.exports= mdLinks;















// const mdLinks = (archive, {validated}={}) => {
// 	return new Promise((resolve,reject) => {
// 		let validation = validated === true ? true : false;
// 		const extNamePath = path.extname(archive);
// 		fs.lstat(archive, (err, fsStat) => {
// 			if (err) {
// 				return console.log(err);
// 			} else {
// 				if (fsStat.isFile()){
// 					if(extNamePath === '.md'){ 
// 					objFunctions.readDocMd(archive, validation)
// 						.then((arrInfoLinksObjects)=> resolve(arrInfoLinksObjects))
// 						.catch((error) => reject(error))
// 					}
// 				} else if (fsStat.isDirectory()) {
// 					showFunctions.showArchivePath(archive);
// 					readDirectory(archive, validation)
// 				} else {(showFunctions.showArchivePath(archive))};
// 			}
// 		});
// 	});
// }

// const readDirectory = (directory, validation) => {
// 	fs.readdir(directory, (err, files) => {
// 		if (err) {
// 			return console.log(chalk.red.bold('Error al procesar el archivo'));
// 		}	else {
// 			files.forEach((doc) => {
// 				const newPath = path.normalize(directory + '/' + doc);
// 				mdLinks(newPath, {validated: validation});
// 			}); 
// 		}
// 	});
// }

// module.exports= mdLinks;




























// const chalk = require('chalk');
// const fs = require('fs');
// const path = require('path');
// const objFunctions = require('./mdLinksFunctions.js');
// const showFunctions = require('./showCliFunctions.js');

// function readArchive(archive, validation, resolve, reject) {
// const extNamePath = path.extname(archive);
// fs.lstat(archive, (err, fsStat) => {
// 	if (err) {
// 		return console.log(err);
// 	} else {
// 		if (fsStat.isFile()){
// 			if(extNamePath === '.md'){ 
// 				objFunctions.readDocMd(archive, validation)
// 					.then((arrInfoLinksObjects)=> resolve(arrInfoLinksObjects))
// 					.catch((error) => reject(error))
// 			}
// 		}  else if (fsStat.isDirectory()) {
// 			showFunctions.showArchivePath(archive);
// 			readDirectory(archive)
// 				.then((files) => {
// 					files.forEach((doc) => {
// 						console.log(files)
// 					const newPath = path.normalize(archive + '/' + doc);
// 					mdLinks(newPath,  {validated: validation});
// 					readDirectory(newPath, validation, resolve, reject);
// 					});
// 				})
// 				.catch((error) => console.log(chalk.red.bold('Error al procesar el archivo', error)))
// 		} else {(showFunctions.showArchivePath(archive))};
// }
// })
// }



// const mdLinks = (archive, {validated}={}) => {
// 	return new Promise((resolve,reject) => {
// 	let validation = validated === true ? true : false;
// 	readArchive(archive, validation, resolve, reject)
// })
// }

// const readDirectory = (directory) => {
// 	return new Promise((resolve,reject) => {
// 	fs.readdir(directory, (err, files) => {
// 		if (err) {
// 			reject(err)
// 			//return console.log(chalk.red.bold('Error al procesar el archivo'));
// 		}	else {
// 			resolve(files)
// 			console.log(files)
// 			// files.forEach((doc) => {
// 			// 	const newPath = path.normalize(directory + '/' + doc);
// 			// 	// mdLinks(newPath,  {validated: validation});
// 			// 	readDirectory(newPath, validation, resolve, reject);
// 			// }); 
// 		}
// 	});
// })
// }

// module.exports= mdLinks;
