const fs = require('fs');
const path = require('path');
const chalk = require('chalk');


// const getLinks = (docContent)=>{
// 	const textLineArray = docContent.split('\n');
// 	textLineArray.forEach(textLine => {
// 	const posibleLink = /http/.test(textLine);
// 	if (posibleLink === true) {
// 		const httpPosition = textLine.indexOf('http');
// 		const startLink = textLine.slice(httpPosition);
// 		const positionParenthesisStart= startLink.indexOf('(');
// 		// const links = startLink.split('http')
// 		// console.log(chalk.yellow(links))
// 		const positionParenthesisEnd = startLink.indexOf(')');
// 		const finalLink = startLink.slice(0, positionParenthesisEnd);
// 		//const finalLink = startLink.slice(positionParenthesisStart+1, positionParenthesisEnd);
// 		// const finalLink = startLink.slice(positionParenthesisStart+1, positionParenthesisEnd);
// 		//console.log(chalk.green(textLine), chalk.red(positionHttp));
// 		console.log(chalk.green(path.normalize(finalLink)));
// 	} 
// 	})
// }

// const getLinks = (docContent)=>{
// 	const textLineArray = docContent.split('\n');
// 	textLineArray.forEach(textLine => {
// 	const httpExist = /http/.test(textLine);
// 	if (httpExist === true) {
// 		const posibleLinksArray = textLine.split('http');
// 		posibleLinksArray.forEach(element => {
// 			let posibleLink = 'http' + element;
// 			//console.log(chalk.yellow(posibleLink));
// 			let httpsStart = posibleLink.startsWith('https://');
// 			let httpStart = posibleLink.startsWith('http://');
// 			if (httpStart === true || httpsStart === true) {
// 				console.log(chalk.magentaBright(posibleLink));
// 			}
// 		})
		
		
// 	} 
// 	})
// }

const searchLinks = (header, compliteHeader,textLine) => {
	let headerLinks = [];
	const posibleLinksArray = textLine.split(header);
	posibleLinksArray.forEach(element => {
		let posibleLink = header + element;
		let compliteHeaderStart = posibleLink.startsWith(compliteHeader);
		if (compliteHeaderStart === true) {
			console.log(chalk.magentaBright(posibleLink));
			const positionParenthesisEnd = posibleLink.indexOf(')');
			if (positionParenthesisEnd !== -1) {
				const finalLink = posibleLink.slice(0, positionParenthesisEnd);
				console.log(chalk.cyanBright(finalLink));
				headerLinks.push(finalLink);
			}
			//headerLinks.push(posibleLink);
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
		console.log(chalk.yellow(textLineLinks));
	} 
	})
}



// const getLinks = (docContent)=>{
// 	// const arrayTextLines = docContent.split('\n');
// 	// arrayTextLines.forEach(textLine => {
// 	// 	const spacesSplit = textLine.split(' ');
// 	// 	spacesSplit.forEach(word => {
// 	// 		const posiblelinkHttps = /https:/.test(word);
// 	// 		if (posiblelinkHttps === true) {
// 	// 			console.log(chalk.green(word));
// 	// 			const mathString= word.match(/https:/g);
// 	// 			console.log(chalk.red(mathString));
// 	// 		}
// 	// 		const posiblelinkHttp = /http:/.test(word);
// 	// 		if (posiblelinkHttp === true) {
// 	// 			console.log(chalk.green(word));
// 	// 			const mathString= word.match(/http:/g);
// 	// 			console.log(chalk.red(mathString));
// 	// 		}
// 	// 	})
// 	// })
// }



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
