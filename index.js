#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const fetch = require('node-fetch');

const cutLinksEnd = (link) => {
	const positionParenthesisEnd = link.indexOf(')');
	let finalLink = (positionParenthesisEnd !== -1) ? (link.slice(0, positionParenthesisEnd)) : (link);
	return finalLink;
}

const showLinkStatus = (res) => {
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

const getUniqueLinks = (infoLinksArray) => {
	let allLinks = infoLinksArray.map((infoLink) => {return infoLink.url});
	let uniqueLinks = allLinks.filter((item, index)=> allLinks.indexOf(item) === index);
	return uniqueLinks;
}

const linksStadistics = (infoLinksArray, validation) => {
	let uniqueLinks = getUniqueLinks(infoLinksArray);
	console.log('TOTAL:', infoLinksArray.length);
	console.log('UNIQUE:', uniqueLinks.length);
	if (validation === true) {
		let linksStatusOk = infoLinksArray.filter(infoLink => infoLink.statusText === 'OK');
		let linksStausFail = infoLinksArray.filter(infoLink => infoLink.statusText === 'FAIL');
		console.log('AVAILABLE:', chalk.green.bold(linksStatusOk.length));
		console.log('BROKEN:', chalk.redBright.bold(linksStausFail.length));
	}
	console.log( '\n');
}

const showLinks = (result, validation, doc) => {
	showArchivePath(doc);
	result.forEach((infoLink) => validation === true ?  showLinkStatus(infoLink) : console.log(infoLink.url));
	console.log('\n');
	return result;
}

const readDocMd = (doc, validation, stats) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	getLinks(docContent, doc)
		.then((allLinksArray) => {
			const promises = allLinksArray.map(getLinkStatus);
			return Promise.all(promises);
		})
		.then((result) => showLinks(result, validation, doc))
		.then((result)=> stats === true ? linksStadistics(result, validation) : '')
		.catch((error) => console.log(chalk.red(error)))
}

const readDirectory = (directory, validation, stadistics) => {
	fs.readdir(directory, (err, files) => {
		if (err) {
			return console.log(chalk.red.bold('Error al procesar el archivo'));
		}	else {
			files.forEach((doc) => {
				const newPath = path.normalize(directory + '/' + doc);
				readArchive(newPath, validation, stadistics);
			}); 
		}
	});
}

const showArchivePath = (pathArchive) => {
	const pathExt = path.extname(pathArchive);
	if (pathExt === '') {
		console.log(chalk.blue.bold.underline(pathArchive));
		console.log(chalk.blue('Accediendo a los archivos Markdown dentro del directorio...' + '\n'));
	} else if (pathExt === '.md') {
		console.log(chalk.magentaBright.bold.underline(pathArchive));
		console.log(chalk.magentaBright('Buscando los links dentro del archivo Markdown...'));
	} else {
		console.log(chalk.gray.bold.underline(pathArchive));
		console.log(chalk.gray('No es un archivo Marckdown' + '\n'));
	}
}


module.exports = readArchive = (archive, validation, stadistics) => {
	const extNamePath = path.extname(archive);
	fs.lstat(archive, (err, stats) => {
    if (err) {
			return console.log(err);
		} else {
			if (stats.isFile()){
			(extNamePath === '.md') ? (readDocMd(archive, validation, stadistics)) :(showArchivePath(archive));
			}  else if (stats.isDirectory()) {
				showArchivePath(archive);
				readDirectory(archive, validation, stadistics);
			}
		}
});
}
