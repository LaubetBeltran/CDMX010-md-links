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
	if (res.ok) {
			const linkStatus = res.status;
			printLinksAndStatus(res.url, linkStatus);
	} else {
		console.log('error');
	}
}

const getLinkStatus = (link) => {
	const fetchPromise = fetch(link);
	fetchPromise.then(checkStatus)
	.catch(console.log(chalk.red(link)))
	}

const getLinks = (docContent)=>{
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
					console.log(chalk.green(finalLink));
					//printLinksAndStatus(finalLink);
					getLinkStatus(finalLink);
				});
			}
		} 
	});

	if(allLinks.length === 0){
		console.log(chalk.gray('No se encotraron links dentro de este archivo.'));
	} else{
		// console.log(chalk.yellow(allLinks));	
	}
	console.log('\n');
}

const readDocMd = (doc) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	getLinks(docContent);
	
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

const readArchive = (archive) => {
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
readArchive('./random');

// readArchive('error');
