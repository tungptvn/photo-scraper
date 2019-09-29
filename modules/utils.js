import {getUserConfig} from './config.js'

function rq(url) {
    return fetch('https://cors-anywhere.herokuapp.com/' + url)
}



async function renderItems(tasks) {
    const elInfo = document.getElementById('info')
    var count = 0
    var total = tasks.length
    if (total > 0) {
        if ('function' == typeof tasks[0].then) {
            tasks.map(x =>
                x.then(_ =>
                    $('#info').text(`${++count}/${total}`))
            )

        }
    }
}

Array.prototype.toSet = function () { return [...new Set(this)] };

async function getImgs(url, i = 0) {


    const toSrc=  a =>  a.match(/src="(.*?)"/)[1] 
    const toAlt=  a => a.match(/alt="(.*?)"/) ? a.match(/alt="(.*?)"/)[1] : ''
    const replaceComma = s=>s.replace(/,/g,'&#44;')
    return new Promise(rs => {
        setTimeout(() => {
            rs(rq(url)
                .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
                .then(x=>x.filter(x=>!/base64/.test(x)) )
                .then(x => x.toSet().map(x => toSrc(x)+'__comma__'+replaceComma( toAlt(x)) ))
                .catch(e => Promise.resolve('__comma__'))

            )

        }, i)
    })
}  


export {rq, renderItems, getImgs}