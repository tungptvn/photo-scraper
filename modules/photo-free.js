import { rq, renderItems, getImgs, render, setArray, limitArray ,href } from './utils.js'
import {getUserConfig} from './config.js'

Array.prototype.toSet = function () { return [...new Set(this)] };

const toHref=  a => a.match(/href="(.*?)"/) ? a.match(/href="(.*?)"/)[1] : ''

async function runFree() {

    var anchors = await rq(getUserConfig().url)
        .then(x => x.text())
        .then(data => data.match(/<a.+\/a>/g))
        .then(x => x.map( a=>  toHref(a) ))

    
    var limit = getUserConfig().limitRq || 200
    var tasks =   limitArray(setArray(anchors), limit).map(async (x,i) => await getImgs( href(x),i))
    renderItems(tasks)
    var imgs = await Promise.all(tasks)
    var text = imgs.reduce((a, c) => a.concat(c), []).toSet()
    .filter(x => getUserConfig().filterImgSrc && new RegExp(getUserConfig().filterImgSrc).test(x))
    .map(x => /proxy/.test(x) ? getUserConfig().origin + '/' + x : x)
    .toString()

    render(text.split(','))
    
}

export {runFree}