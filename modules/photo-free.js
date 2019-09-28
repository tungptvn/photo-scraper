
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

var imgs = await Promise.all( [...new Set(anchors)].map( async (x) => await getImgs( x )))
var text = imgs.reduce( (a,c)=>a.concat(c),[]).toSet().toString()
text
