const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

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
					console.log(chalk.green(finalLink)); //, chalk.blue(typeof(finalLink)));
					allLinks.push(finalLink);
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
		console.log(chalk.blue('I am a .md'));
		showArchivePath(archive, extNamePath);
		readDocMd(archive);
	} else if (extNamePath === '') {
		console.log(chalk.cyan('I am a directory'));
		showArchivePath(archive, extNamePath);
		readDirectory(archive);
	}
}

// readArchive('./random/ejemplo.md');
// readArchive('./README.md');
readArchive('./random');
// readArchive('error');