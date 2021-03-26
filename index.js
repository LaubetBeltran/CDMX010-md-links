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

const printLinksAndStatus = (link, status) =>{
	console.log(chalk.green(link), chalk.blue(status));
}

const checkStatus= (res) => {
	// if (res.ok) {
	// 	console.log(chalk.green(res.url), chalk.blue(res.status));
	// } else {
	// 	console.log(chalk.red(res.url, res.status));
	// }
	return res
}

const getLinkStatus = (link) => {
	return fetch(link)
	.then(checkStatus)
	.catch((error) => {
		console.log(chalk.red('Status error', error))})
}

const getLinks = (docContent)=>{
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
		console.log(chalk.gray('No se encotraron links dentro de este archivo.'));
	} else{
		resolve(allLinks);
	}
	console.log('\n');
	})
	
}

const readDocMd = (doc) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	getLinks(docContent)
		.then((allLinks) => {
			const promises = allLinks.map(getLinkStatus)
			return Promise.all(promises);
		})
		.then(result => console.log(result)) // [200, 200, 200, ...]
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

const showArchivePath = (pathArchive, pathExt) => {
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

const readArchive = async (archive) => {
	const extNamePath = path.extname(archive);
	showArchivePath(archive, extNamePath);
	if (extNamePath === '.md') {
		readDocMd(archive);
	} else if (extNamePath === '') {
		readDirectory(archive);
	}
}

// readArchive('./random/ejemplo.md');
// readArchive('./README.md');
// readArchive('./random');

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
