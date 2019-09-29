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
    console.log('url',url)
    if(!(new RegExp(getUserConfig().url).test(url))) url = getUserConfig().url+ url 
    console.log('url1',url)
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


export {rq, renderItems, getImgs}