import { getUserConfig } from './config.js'

function rq(url) {
    var h = href(url)
    return fetch(getUserConfig().crosAnywhere ? 'https://cors-anywhere.herokuapp.com/' + h : h)
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
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
const setArray = (arr) => [...new Set(arr)]
const limitArray = (arr, number) => arr.length < number ? arr : arr.splice(0, number)

async function getImgs(url, i = 0) {

    
    const toSrc = a => a.match(/src="(.*?)"/)[1]
    const toAlt = a => a.match(/alt="(.*?)"/) ? a.match(/alt="(.*?)"/)[1] : ''
    const replaceComma = s => s.replace(/,/g, '&#44;')
    return new Promise(rs => {
        setTimeout(() => {
            rs(rq(url)
                .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
                .then(x => x.filter(x => !/base64/.test(x)))
                .then(x => setArray(x).map(x => toSrc(x) + '__comma__' + replaceComma(toAlt(x))))
                .catch(e => Promise.resolve('__comma__'))

            )

        }, i*getUserConfig().timeDelay)
    })
}
function render(imgs) {
    var total = imgs.length, loaded = 0
    if (total == 0) return
    $('.Images').html('')
    var selectSrc = x => x.split('__comma__')[0], selectAlt = x => x.split('__comma__')[1]


    imgs.map(x => $(`<div class="Image">
                        <div class="Image-overlay"></div>
                        <img src="${selectSrc(x)}" data-zoom="${selectSrc(x)}" title="${selectAlt(x)}" alt="${selectAlt(x)}">
                      </div>`))
        .map((img, i) => {
            var imgEl = img.find('img')[0]
            imgEl.onload = function () {
                $('#info').text(++loaded + '/' + total)
            }
            imgEl.onerror = function () {
                console.log('img error', imgEl.src)
                this.style.display = "none";
            }
            $('.Images').append(img)

        })

}

//#region url
const href = url  => { 
    //console.log('image url ===>', url)
    var ret = url
    if(!/^http/.test(url)){
        var urlex = getUserConfig().url.split('/') ,origin =  urlex[0] + '//' + urlex[2]
        if(url.charAt(0)!=='/') ret=  origin+'/'+url
        else ret= getUserConfig().url+ url.replace(/^\//,'')
         
    }
    return ret 
}
//#endregion





export { rq, renderItems, getImgs, render, setArray, limitArray, compose,href }