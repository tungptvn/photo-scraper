import { rq, renderItems, getImgs, render, setArray } from './utils.js';
import { getUserConfig } from './config.js'

async function runForum() {

    var tasks = Array.from(Array(getUserConfig().pTo - getUserConfig().pFrom).keys())
        .map(x => getUserConfig().url + getUserConfig().pageTemplate.replace('__pageNum__', x + getUserConfig().pFrom + 1))
        .filter(urlRq=> getUserConfig().filterRq && new RegExp(getUserConfig().filterRq).test(urlRq)) 
        .map((url, i) => getImgs(url, i))

        renderItems(tasks)
    var ret = await Promise.all(tasks);


    var urlex = getUserConfig().url.split('/'), baseUrl = urlex[0] + '//' + urlex[2]
    var text = setArray( ret.reduce((a, c) => a.concat(c), []))
        .map(x => /proxy/.test(x) ? baseUrl + '/' + x : x)
        .filter(x => ( getUserConfig().filterImgSrc && new RegExp(getUserConfig().filterImgSrc).test(x)))
        .toString()
    render(text.split(','))

}

export { runForum, getUserConfig }

