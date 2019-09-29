import { rq, renderItems } from './utils.js'
import {getUserConfig} from './config.js'

Array.prototype.toSet = function () { return [...new Set(this)] };

async function getImgs(url, i = 0) {
    return new Promise(rs => {
        setTimeout(() => {
            rs(rq(url)
                .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
                .then(x => x.toSet().map(x => x.match(/src="(.*?)"/)[1]))
                .catch(e => Promise.resolve(''))

            )

        }, i)
    })
}
async function runFree() {

    var anchors = await rq(getUserConfig().url)
        .then(x => x.text())
        .then(data => data.match(/<a.+\/a>/g))
        .then(x => x.map(a => a.match(/href="(.*?)"/) ? a.match(/href="(.*?)"/)[1] : ''))

    var tasks = anchors.toSet().map(async (x,i) => await getImgs(x,i))
    renderItems(tasks)
    var imgs = await Promise.all(tasks)
    var text = imgs.reduce((a, c) => a.concat(c), []).toSet().toString()
    return text
}

export {runFree}