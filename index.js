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

function showLinkStatus(res) {
	if (res.statusText === 'OK') { 
		console.log(chalk.green(res.url), chalk.yellow(res.status, res.statusText));
	} else {
		console.log(chalk.red(res.url), chalk.yellow(res.status, res.statusText));
	}
}

const getLinkStatus = (link) => {
	return fetch(link)
    .then((res) => {
			return res.ok ? {status: res.status, statusText: 'OK', url:link} : {status: res.status, statusText: 'FAIL', url:link}
		})
		.catch(() => {
			return { status: 500, statusText: 'FAIL', url: link}
		})
}

const getLinks = (docContent, docPath)=>{
	return new Promise((resolve, reject) => {
		const textLineArray = docContent.split('\n');
		let allLinksArray = [];
		textLineArray.forEach(textLine => {
			const httpExist = /http/.test(textLine);
			if (httpExist === true) {
				const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
				const regex = new RegExp(expression);
				const linkMatch = textLine.match(regex);
				if (linkMatch) {
					linkMatch.forEach(link =>{
						const finalLink = cutLinksEnd(link);
						allLinksArray.push(finalLink);
					});
				}
			} 
		});
		if(allLinksArray.length === 0){
			showArchivePath(docPath)
			console.log(chalk.gray('No se encotraron links dentro de este archivo.'), '\n');
		} else {
			resolve(allLinksArray);
		}
	});
}

const readDocMd = (doc) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	getLinks(docContent, doc)
		.then((allLinksArray) => {
			const promises = allLinksArray.map(getLinkStatus);
			return Promise.all(promises);
		})
		.then((result) => {
			showArchivePath(doc);
			result.forEach((infoLink) => showLinkStatus(infoLink));
		})
		.catch((error) => console.log(chalk.red(error)))
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
