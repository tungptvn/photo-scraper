# photo-scraper
https://tungptvn.github.io/photo-scraper


```javascript
function getImgs(url,i=0){
 return new Promise( rs =>{
			setTimeout(()=>{
				rs(fetch(url)
                    .then(x=> x.text()).then(data=> data.match(/<img.+\/>/g))
                    .then(x=>Array.from(new Set(x)).map(x=>x.match(/src="(.*?)"/)[1]))
					)

				},i* timeToDelay())
	} )  
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

var ret  =  await Promise.all(Array.from(Array( page().to - page().from ).keys())
.map(x=> window.location.href+`&page=${x + page().from +1}`)
.map( (url,i)=>getImgs(url,i)));

var text = [...new Set (ret.reduce( (a,c)=>a.concat(c),[] ))]
//.map(x=> /proxy/.test(x)? window.location.origin + '/' + x : x )
.filter(x=>/http/.test(x)).toString()

function config(){ return { isDelay : true , pageTemplate : '&page=__pageNum__'  } }
function timeToDelay() { return 1000 }
function page(){ return { from:0, to: 10 } }

copy(text) || text
```
