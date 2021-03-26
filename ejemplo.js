const fetch = require('node-fetch');

const getLinkStatus = (link) => {
	let validos=[]
	fetch(link)
	.then((res)=>console.log(res,'una vez'))
	.catch(e=>console.log(e))
	}

	getLinkStatus('https://laumecaesmuybien.com')