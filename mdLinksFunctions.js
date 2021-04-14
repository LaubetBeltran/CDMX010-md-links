const fs = require('fs');
const chalk = require('chalk');
const fetch = require('node-fetch');
const showFunctions = require('./showCliFunctions.js');
const cutLinksEnd = (link) => {
	const positionParenthesisEnd = link.indexOf(')');
	let finalLink = (positionParenthesisEnd !== -1) ? (link.slice(0, positionParenthesisEnd)) : (link);
	return finalLink;
}

const getLinkStatus = (link, doc) => {
	return fetch(link)
    .then((res) => {
			return res.ok ? {status: res.status, statusText: 'OK', url:link, file: doc, ok: true} : {status: res.status, statusText: 'FAIL', url:link, file: doc, ok: false};
		})
		.catch(() => {
			return { status: 500, statusText: 'FAIL', url: link, file: doc, ok: false}
		})
}

const getLinks = (docContent, docPath)=>{
	return new Promise((resolve) => {
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
			showFunctions.showArchivePath(docPath)
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


const readDocMd = (doc, validation) => {
	return new Promise((resolve, reject) => {
	const docContent = fs.readFileSync(doc, 'utf8');
	getLinks(docContent, doc)
		.then((allLinksArray) => {
			if (validation === false) {
				const linksObjet = allLinksArray.map((link) => {return { href: link, file: doc }});
				resolve(linksObjet); 
			} else {
				const promises = allLinksArray.map((link) => getLinkStatus(link, doc));
				return Promise.all(promises);
			}
		})
		.then((result) => {
			if (validation === true) {
				const validatedLinksObject = result.map((infolink)=> {
				return { href: infolink.url, file: doc, status:infolink.status, ok: infolink.ok}})
				resolve(validatedLinksObject)
			}
		})
		.catch((error) => reject(error))
		})
}



module.exports = {
	'readDocMd' : readDocMd,
	'linksStadistics': linksStadistics,
	'getUniqueLinks': getUniqueLinks,
	'getLinks': getLinks,
	'getLinkStatus': getLinkStatus,
	'cutLinksEnd': cutLinksEnd,
}
