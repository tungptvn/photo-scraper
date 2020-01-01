const config = {
    url: '__url__',
    pFrom: 0, pTo: 10,
    pageTemplate: 'page-__pageNum__',
    filterRq: 'http',
    filterImgSrc: 'http',
    isFree: false,
    crosAnywhere: true,
    timeDelay: 1000,
    limitRq: 200
    //pageTemplate: '&page=__pageNum__'
}

function getUserConfig() {
    var searchParams = new URLSearchParams(window.location.search);
    var ret = JSON.parse(searchParams.get('userConfig')) || config
    var urlex = config.url.split('/') ,origin =  urlex[0] + '//' + urlex[2]
    ret.origin = origin
    return ret
}
export { getUserConfig }