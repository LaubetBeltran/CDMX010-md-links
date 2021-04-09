#! /usr/bin/env node
const mdLinks = require('./mdLinks.js')

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

const initMdLinks= () => {
const inputDoc = getInputPath('index.js', 3);
const validation = getOptions('--validate');
const stadistics = getOptions('--stats');
mdLinks(inputDoc, validation, stadistics);
}

initMdLinks();