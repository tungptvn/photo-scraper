import { rq ,renderItems} from './utils.js';
import {getUserConfig} from './config.js'

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

async function runForum() {
    var tasks = Array.from(Array(getUserConfig().pTo - getUserConfig().pFrom).keys())
    .map(x => getUserConfig().url + getUserConfig().pageTemplate.replace('__pageNum__', x + getUserConfig().pFrom + 1))
    .map((url, i) => getImgs(url, i))
    renderItems(tasks)
    var ret = await Promise.all(tasks);


    var urlex = getUserConfig().url.split('/'), baseUrl = urlex[0] + '//' + urlex[2]
    var text = [...new Set(ret.reduce((a, c) => a.concat(c), []))]
        .map(x => /proxy/.test(x) ? baseUrl + '/' + x : x)
        .filter(x => new RegExp(getUserConfig().filter).test(x)).toString()
    return text

}

export { runForum, getUserConfig }

