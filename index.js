const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const readDocMd = (doc) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	console.log(chalk.magentaBright(docContent));
}

const readDirectory = (directory) => {
	fs.readdir(directory, (err, files) => {
		if (err){
			return console.log('Error al imprimir los archivos')
		}	else {
			console.log(chalk.yellow(files));
			files.forEach((doc) => {
				//const newPath = path.normalize(directory + '/' + doc);
				const newPath = directory + '/' + doc;
				readArchive(newPath);
			}); 
		}
	});
}

const readArchive = (archive) => {
	const extNamePath = path.extname(archive);
	if (extNamePath === '.md') {
		console.log(chalk.blue('i am a .md'));
		readDocMd(archive);
	} else if (extNamePath === '') {
		console.log(chalk.cyan('I am a directory'));
		readDirectory(archive);
	}
}

//readArchive('./random/ejemplo.md');
readArchive('./random');
