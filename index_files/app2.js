cf = {
    timeDelay: 1000,
    pFrom: 0, pTo: 105,
    //pageTemplate: 'page-__pageNum__'
    pageTemplate: '&page=__pageNum__'
}


async function getImgs(url, i = 0) {
    if (i != 0) await sleep(i * cf.timeDelay)
    return await fetch(url)
        .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
        .then(x => Array.from(new Set(x)).map(x => x.match(/src="(.*?)"/)[1]))

}

var ret = await Promise.all(Array.from(Array(cf.pTo - cf.pFrom).keys())
    .map(x => window.location.href + cf.pageTemplate.replace('__pageNum__', x + cf.pFrom + 1))
    .map((url, i) => getImgs(url, i)));

var text = [...new Set(ret.reduce((a, c) => a.concat(c), []))]
    .map(x => /proxy/.test(x) ? window.location.origin + '/' + x : x)
    .filter(x => /http/.test(x)).toString()


text


function sleep(time) {
    return new Promise((rs) => setTimeout(() => rs(), time))
}

var task = async function () {
    await sleep(1000)
    Console.log('helo');
}

var anchors = await fetch(window.location.href)
    .then(x => x.text()).then(data => data.match(/<a.+\/a>/g)).then(x => x.map(a => $(a)[0]))

async function getImgs(url, i = 0) {
    if (i != 0) await sleep(i * cf.timeDelay)
    return await fetch(url)
        .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
        .then(x => Array.from(new Set(x)).map(x => x.match(/src="(.*?)"/)[1]))

}
imgs = await Promise.all(anchors.map(x => x.href).map(async (x) => await getImgs(x)))

Array.prototype.toSet = function(){ return [...new Set(this)]}


//
Array.prototype.toSet = function(){ return [...new Set(this)]};

async function getImgs(url, i = 0) {
    return new Promise(rs => {
        setTimeout(() => {
            rs(fetch(url)
                .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
                .then(x => Array.from(new Set(x)).map(x => x.match(/src="(.*?)"/)[1]))
				.catch(e=>Promise.resolve(''))
				
            )

        },i)
    })
}
var anchors = await fetch(window.location.href)
    .then(x => x.text()).then(data => data.match(/<a.+\/a>/g)).then(x => x.map(a => a.match(/href="(.*?)"/)?a.match(/href="(.*?)"/)[1]:''))

var imgs = await Promise.all( [...new Set(anchors)].filter(x=>/http/.test(x)&&/vnexpress/.test(x)).map( async (x) => await getImgs( x )))
var text = imgs.reduce( (a,c)=>a.concat(c),[]).toSet().toString()
text