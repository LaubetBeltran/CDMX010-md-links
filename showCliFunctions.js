const chalk = require('chalk');
const path = require('path');

const showLinkStatus = (res) => {
	if (res.ok === true) { 
		console.log(chalk.green(res.href), chalk.yellow(res.status, 'OK'));
	} else {
		console.log(chalk.red(res.href), chalk.yellow(res.status, 'FAIL'));
	}
}

const showLinks = (result, validation, doc) => {
	showArchivePath(doc);
	result.forEach((infoLink) => validation === true ?  showLinkStatus(infoLink) : console.log(infoLink.href));
	console.log('\n');
}


const showArchivePath = (pathArchive) => {
	const pathExt = path.extname(pathArchive);
	if (pathExt === '') {
		console.log(chalk.blue.bold.underline(pathArchive));
		console.log(chalk.blue('Accediendo a los archivos Markdown dentro del directorio...' + '\n'));
	} else if (pathExt === '.md') {
		console.log(chalk.magentaBright.bold.underline(pathArchive));
		console.log(chalk.magentaBright('Buscando los links dentro del archivo Markdown...'));
	} else {
		console.log(chalk.gray.bold.underline(pathArchive));
		console.log(chalk.gray('No es un archivo Marckdown' + '\n'));
	}
}


module.exports = {
	'showArchivePath' : showArchivePath,
	'showLinks': showLinks,
	'showLinkStatus': showLinkStatus,
}