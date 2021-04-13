const mdLinks = require('../mdLinks.js');
const { getUniqueLinks } = require('../mdLinksFunctions.js');
const mdLinksFunctions = require('../mdLinksFunctions.js');

const objectLinkMock200 = {status: 200, statusText: 'OK', url: 'https://nodejs.org/api/modules.html'};
const objectLinkMock404 = {status: 404, statusText: 'FAIL', url: 'http://algo.com/2/3/'};
const objectLinkMock500 = {status: 500, statusText: 'FAIL', url: 'https://otra-cosa.net/algun-doc.html'};

const textMdMock = `## 1. Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...), y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional README.md).

Estos archivos Markdown normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de        
la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una
herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
en formato Markdown, para verificar los links que contengan y reportar
algunas estadísticas.

![md-links](https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg)
[Blablabla] (http://algo.com/2/3/)
[Node.js](https://nodejs.org/)`;

const arrayLinksMock = ['https://es.wikipedia.org/wiki/Markdown', 'https://nodejs.org/', 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg', 'http://algo.com/2/3/', 'https://nodejs.org/'];
const arrayUniqueLinksMock = ['https://es.wikipedia.org/wiki/Markdown', 'https://nodejs.org/', 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg', 'http://algo.com/2/3/'];

const infoLinksArrayMock = [{status: 200, statusText: 'OK', url: 'https://es.wikipedia.org/wiki/Markdown'}, {status: 200, statusText: 'OK', url: 'https://nodejs.org/'}, {status: 200, statusText: 'OK', url: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg'}, {status: 404, statusText: 'FAIL', url: 'http://algo.com/2/3/'}, {status: 200, statusText: 'OK', url: 'https://nodejs.org/'}]


describe('mdLinks', () => {
	it('debería ser una función', () => {
    expect(typeof mdLinks).toBe('function');
  });
});

describe('getLinksStatus', () => {
	it('debería ser una función', () => {
    expect(typeof mdLinksFunctions.getLinkStatus).toBe('function');
  });
	it('si recibe un link OK, debe regresar un objeto con status 200', () => {
		return mdLinksFunctions.getLinkStatus('https://nodejs.org/api/modules.html').then(data => {
    expect(data).toStrictEqual(objectLinkMock200);
  });
	});
	it('si recibe un link roto, debe regresar un objeto con status 404', () => {
		return mdLinksFunctions.getLinkStatus('http://algo.com/2/3/').then(data => {
    expect(data).toStrictEqual(objectLinkMock404);
  });
	});
	it('si recibe un link roto, debe regresar un objeto con status 404', () => {
		return mdLinksFunctions.getLinkStatus('http://algo.com/2/3/').catch(error => {
    expect(error).toStrictEqual(objectLinkMock500);
  });
	});
});

test('getLinks regresa un array con los links de un texto md', () => {
  return expect(mdLinksFunctions.getLinks(textMdMock)).resolves.toStrictEqual(arrayLinksMock);
});

describe('getUniqueLinks', () => {
	it('getUniqueLinks encuentra los links únicos en un array de objetos con la info de los links obtenidos', () => {
			expect(mdLinksFunctions.getUniqueLinks(infoLinksArrayMock)).toStrictEqual(arrayUniqueLinksMock);
	})
});
