cf = {
    timeDelay: 0,
    pFrom: 0, pTo: 17,
	pageTemplate: 'page-__pageNum__'
    //pageTemplate: '&page=__pageNum__'
}


function getImgs(url, i = 0) {
    return new Promise(rs => {
        setTimeout(() => {
            rs(fetch(url)
                .then(x => x.text()).then(data => data.match(/<img.+\/>/g))
                .then(x => Array.from(new Set(x)).map(x => x.match(/src="(.*?)"/)[1]))
            )

        }, i * cf.timeDelay)
    })
}
function copy(text) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)
    return result;
}

var ret = await Promise.all(Array.from(Array(cf.pTo - cf.pFrom).keys())
    .map(x => window.location.href + cf.pageTemplate.replace('__pageNum__', x + cf.pFrom + 1))
    .map((url, i) => getImgs(url, i)));

var text = [...new Set(ret.reduce((a, c) => a.concat(c), []))]
    .map(x => /proxy/.test(x) ? window.location.origin + '/' + x : x)
    .filter(x => /http/.test(x)).toString()


copy(text) || text