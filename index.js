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
			console.log(chalk.magentaBright(posibleLink));
			const positionParenthesisEnd = posibleLink.indexOf(')');
			const positionSpaces = posibleLink.indexOf(' ');
			if (positionParenthesisEnd !== -1) {
				const finalLink = posibleLink.slice(0, positionParenthesisEnd);
				console.log(chalk.cyanBright(finalLink));
				headerLinks.push(finalLink);
			} else if (positionSpaces !== -1) {
				const finalLink = posibleLink.slice(0, positionSpaces);
				console.log(chalk.cyanBright(finalLink));
				headerLinks.push(finalLink);
			}
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
	console.log(chalk.yellow(allLinks));
}

const readDocMd = (doc) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	//console.log(chalk.magentaBright(docContent));
	getLinks(docContent);
	
}

const readDirectory = (directory) => {
	fs.readdir(directory, (err, files) => {
		if (err) {
			return console.log(chalk.red.bold('Error al procesar el archivo'));
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
readArchive('./README.md');
//readArchive('./random');
