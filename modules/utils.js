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
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
const setArray = ( arr) => [...new Set(arr)]
const limitArray = (arr,number) => arr.length < number? arr : arr.splice(0,number)

async function getImgs(url, i = 0) {


    const toSrc=  a =>  a.match(/src="(.*?)"/)[1] 
    const toAlt=  a => a.match(/alt="(.*?)"/) ? a.match(/alt="(.*?)"/)[1] : ''
    const replaceComma = s=>s.replace(/,/g,'&#44;')
    return new Promise(rs => {
        setTimeout(() => {
            rs(rq(url)
                .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
                .then(x=>x.filter(x=>!/base64/.test(x)) )
                .then(x => setArray(x).map(x => toSrc(x)+'__comma__'+replaceComma( toAlt(x)) ))
                .catch(e => Promise.resolve('__comma__'))

            )

        }, i)
    })
}  

function render(imgs) {
    var total = imgs.length, loaded = 0
    if (total == 0) return
    $('.Images').html('')
    var selectSrc = x=>x.split('__comma__')[0], selectAlt = x=>x.split('__comma__')[1]
    console.log('imgs',imgs)
  
    imgs.map(x => $(`<div class="Image">
                        <div class="Image-overlay"></div>
                        <img src="${selectSrc(x)}" data-zoom="${selectSrc(x)}" title="${selectAlt(x)}" alt="${selectAlt(x)}">
                      </div>`))
      .map((img, i) => {
        img.find('img')[0].onload = function () {
          $('#info').text(++loaded + '/' + total)
        }
        $('.Images').append(img)
  
      })
  
  }
export {rq, renderItems, getImgs, render, setArray, limitArray, compose }