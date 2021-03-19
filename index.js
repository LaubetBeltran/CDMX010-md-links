const fs = require('fs');

const ReadDoc = (doc) => {
	const mdDocFilter = doc.endsWith('.md');
  if (mdDocFilter === true) {
		const docContent = fs.readFileSync(doc, 'utf8');
		console.log(docContent);
	} else {
		console.log('no soy un archivo ".md"');
	}
}

//ReadDoc('README.md');
ReadDoc('docPrueba.txt');
