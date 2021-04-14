#! /usr/bin/env node
const mdLinks = require('./mdLinks.js');
const showFunctions = require('./showCliFunctions.js');
const objFunctions = require('./mdLinksFunctions.js');

const getInputPath = (p, displacementNum) => {
	const index = process.argv.indexOf(p);
	return process.argv[index + displacementNum];
}

const getOptions = (option) => {
	const index = process.argv.indexOf(option);
	let optioinBoolean = false;
	index !== -1 ? optioinBoolean = true : optioinBoolean;
	return optioinBoolean;
}

const callMDLinks = (inputPath, validation, stadistics) => {
	mdLinks(inputPath, {validated: validation})
	.then((result)=> {
		showFunctions.showLinks(result,validation, inputPath)
		return result;
	})
	.then((result)=> stadistics === true ? objFunctions.linksStadistics(result, validation) : '')
	.catch((error)=> console.log(console.error))
}

const initMdLinks= () => {
	const inputPath = getInputPath('cli.js', 3);
	const validation = getOptions('--validate');
	const stadistics = getOptions('--stats');
	callMDLinks(inputPath, validation, stadistics);

}


initMdLinks();
