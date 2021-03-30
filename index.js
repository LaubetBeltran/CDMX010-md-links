const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const fetch = require('node-fetch');

const cutLinksEnd = (link) => {
	const positionParenthesisEnd = link.indexOf(')');
	let finalLink = '';
	if (positionParenthesisEnd !== -1) {
		finalLink = link.slice(0, positionParenthesisEnd);
	} else {
		finalLink = link;
	}
	return finalLink;
}

function myExcepionErr(mensaje) {
	console.log(mensaje);
}

function checkStatus(res) {
	if (res.ok) { 
		return console.log(chalk.green(res.url), chalk.yellow(res.status, res.statusText));
	} else {
		if (res.status){
			return console.log(chalk.red(res.url), chalk.yellow(res.status, res.statusText));
		} else {
			return console.log('Status error', res.code);
		}
		
	}
}

const getLinkStatus = (link) => {
	return fetch(link)
    .then((res) => {return res })
		.catch((error) => {return error;})//return console.log(link, error.code)})
}

// const getLinkStatus = (link) => {
// 	return fetch(link)
// 	.then((res) => { return res})
// 	.catch((error) => {
// 		console.log(chalk.red(error));
// 		return error;
// 	})
// }

const getLinks = (docContent, docPath)=>{
	return new Promise((resolve, reject) => {
		const textLineArray = docContent.split('\n');
		let allLinks = [];
		textLineArray.forEach(textLine => {
			const httpExist = /http/.test(textLine);
			if (httpExist === true) {
				const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
				const regex = new RegExp(expression);
				const linkMatch = textLine.match(regex);
				if (linkMatch) {
					linkMatch.forEach(link =>{
						const finalLink = cutLinksEnd(link);
						allLinks.push(finalLink);
						getLinkStatus(finalLink);
					});
				}
			} 
		});
		if(allLinks.length === 0){
			showArchivePath(docPath)
			console.log(chalk.gray('No se encotraron links dentro de este archivo.'), '\n');
		} else {
			resolve(allLinks);
		}
	});
}

const readDocMd = (doc) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	getLinks(docContent, doc)
		.then((allLinks) => {
			const promises = allLinks.map(getLinkStatus);
			return Promise.all(promises);
		})
		.then((result) =>{
			showArchivePath(doc);
			result.forEach((infoLink) => {
				checkStatus(infoLink);
				
		})
		console.log('\n');
			// result.forEach((infoLink) => {
			// 	// console.log(chalk.green(infoLink.url), chalk.blue(infoLink.status));
			// 	if (infoLink.status === 200) {
			// 	console.log(chalk.green(infoLink.url), chalk.blue(infoLink.status));
			// 	} else {
			// 	console.log(chalk.red(infoLink.url, infoLink.status));
			// 	}
			// });
			// console.log('\n');
		})
		.catch((error) => {
			console.log(chalk.red(error))})
}

const readDirectory = (directory) => {
	fs.readdir(directory, (err, files) => {
		if (err) {
			return console.log(chalk.red.bold('Error al procesar el archivo'));
		}	else {
			files.forEach((doc) => {
				const newPath = path.normalize(directory + '/' + doc);
				readArchive(newPath);
			}); 
		}
	});
}

const showArchivePath = (pathArchive) => {
	const pathExt = path.extname(pathArchive);
	if (pathExt === '') {
		console.log(chalk.blue.bold.underline(pathArchive));
		console.log(chalk.blue('Accediendo a los archivos Markdown dentro del directorio...' + '\n'));
	} else if (pathExt == '.md') {
		console.log(chalk.magentaBright.bold.underline(pathArchive));
		console.log(chalk.magentaBright('Buscando los links dentro del archivo Markdown...'));
	} else {
		console.log(chalk.gray.bold.underline(pathArchive));
		console.log(chalk.gray('No es un archivo Marckdown' + '\n'));
	}
}

const readArchive = (archive) => {
	const extNamePath = path.extname(archive);
	if (extNamePath === '.md') {
		readDocMd(archive);
	} else if (extNamePath === '') {
		showArchivePath(archive);
		readDirectory(archive);
	}
}

// readArchive('./random/ejemplo.md');
//readArchive('./README.md');
//readArchive('./random');
// readArchive('error');

const getInput = (p) => {
	var index = process.argv.indexOf(p);
	return process.argv[index + 1];
}

const initMdLinks= () => {
var inputDoc = getInput('--path');
readArchive(inputDoc);
}
initMdLinks();
