import { rq } from './utils.js';
const config = {
    timeDelay: 0,
    url: '',
    pFrom: 0, pTo: 10,
    pageTemplate: 'page-__pageNum__',
    filter: 'http'
    //pageTemplate: '&page=__pageNum__'
}

function getUserConfig() {
    var searchParams = new URLSearchParams(window.location.search);
    return JSON.parse(searchParams.get('userConfig')) || config
}

function getImgs(url, i = 0) {
    var base = url.split('/')[2]
    return new Promise(rs => {
        setTimeout(() => {
            rs(rq(url)
                .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
                .then(x => Array.from(new Set(x)).map(x => x.match(/src="(.*?)"/)[1]))
                .catch(_ => rs())
            )

        }, i * getUserConfig().timeDelay)
    })
}
// function copy(text) {
//     var input = document.createElement('input');
//     input.setAttribute('value', text);
//     document.body.appendChild(input);
//     input.select();
//     var result = document.execCommand('copy');
//     document.body.removeChild(input)
//     return result;
// }

async function run() {
    var ret = await Promise.all(Array.from(Array(getUserConfig().pTo - getUserConfig().pFrom).keys())
        .map(x => getUserConfig().url + getUserConfig().pageTemplate.replace('__pageNum__', x + getUserConfig().pFrom + 1))
        .map((url, i) => getImgs(url, i)));
    var urlex = getUserConfig().url.split('/'), baseUrl = urlex[0] + '//' + urlex[2]
    var text = [...new Set(ret.reduce((a, c) => a.concat(c), []))]
        .map(x => /proxy/.test(x) ? baseUrl + '/' + x : x)
        .filter(x => new RegExp(getUserConfig().filter).test(x)).toString()
    return text

}

export { run, getUserConfig }

