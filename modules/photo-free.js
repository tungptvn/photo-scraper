import { rq, renderItems, getImgs } from './utils.js'
import {getUserConfig} from './config.js'

Array.prototype.toSet = function () { return [...new Set(this)] };

const toHref=  a => a.match(/href="(.*?)"/) ? a.match(/href="(.*?)"/)[1] : ''
const toAlt=  a => a.match(/alt="(.*?)"/) ? a.match(/alt="(.*?)"/)[1] : ''
const selectHref = x=>x.split(':')[0]

async function runFree() {

    var anchors = await rq(getUserConfig().url)
        .then(x => x.text())
        .then(data => data.match(/<a.+\/a>/g))
        .then(x => x.map( a=>  toHref(a) ))

    var tasks = anchors.toSet().map(async (x,i) => await getImgs(x,i))
    renderItems(tasks)
    var imgs = await Promise.all(tasks)
    var text = imgs.reduce((a, c) => a.concat(c), []).toSet().toString()
    return text
}

export {runFree}