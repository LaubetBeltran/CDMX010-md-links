const fs = require('fs');
const path = require('path');
const chalk = require('chalk');


const searchLinks = (header, compliteHeader, textLine) => {
	let headerLinks = [];
	const posibleLinksArray = textLine.split(header);
	posibleLinksArray.forEach(element => {
		let posibleLink = header + element;
		let compliteHeaderStart = posibleLink.startsWith(compliteHeader);
		if (compliteHeaderStart === true) {
			// console.log(chalk.magentaBright(posibleLink));
			const positionParenthesisEnd = posibleLink.indexOf(')');
			const positionSpaces = posibleLink.indexOf(' ');
			let finalLink = '';
			if (positionParenthesisEnd !== -1) {
				finalLink = posibleLink.slice(0, positionParenthesisEnd);
			} else if (positionSpaces !== -1) {
				finalLink = posibleLink.slice(0, positionSpaces);
			} else {
				finalLink = posibleLink;
			}
			console.log(chalk.green(finalLink));
			headerLinks.push(finalLink);
		}
	});
	return headerLinks;
}

const getLinks = (docContent)=>{
	const textLineArray = docContent.split('\n');
	let allLinks = [];
	textLineArray.forEach(textLine => {
		const httpExist = /http/.test(textLine);
		if (httpExist === true) {
			const linkhttp = searchLinks('http:', 'http://', textLine);
			const linkhttps = searchLinks('https:', 'https://', textLine);
			const textLineLinks = linkhttp.concat(linkhttps);
			textLineLinks.forEach(arr => allLinks.push(arr));
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
			// console.log(chalk.yellow(files));
			files.forEach((doc) => {
				//const newPath = path.normalize(directory + '/' + doc);
				const newPath = directory + '/' + doc;
				readArchive(newPath);
			}); 
		}
	});
}

const showArchivePath = (pathArchive, pathExt) => {
	if (pathExt === '') {
		console.log(chalk.cyan.bold.underline(pathArchive));
		console.log(chalk.cyan('Accediendo a los archivos Markdown dentro del directorio...' + '\n'));
	} else if (pathExt == '.md') {
		console.log(chalk.magentaBright.bold.underline(pathArchive));
		console.log(chalk.magentaBright('Buscando los links dentro del archivo Markdown...'));
	}
}

const readArchive = (archive) => {
	const extNamePath = path.extname(archive);
	if (extNamePath === '.md') {
		// console.log(chalk.blue('i am a .md'));
		showArchivePath(archive, extNamePath);
		readDocMd(archive);
	} else if (extNamePath === '') {
		// console.log(chalk.cyan('I am a directory'));
		showArchivePath(archive, extNamePath);
		readDirectory(archive);
	}
}

// readArchive('./random/ejemplo.md');
// readArchive('./README.md');
readArchive('./random');
// readArchive('error');