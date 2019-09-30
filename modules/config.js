const config = {
    timeDelay: 0,
    url: '__url__',
    pFrom: 0, pTo: 10,
    pageTemplate: 'page-__pageNum__',
    filterRq: 'http',
    filterImgSrc: 'http' ,
    isFree: true,
    crosAnywhere: false
    //pageTemplate: '&page=__pageNum__'
}

function getUserConfig() {
    var searchParams = new URLSearchParams(window.location.search);
    return JSON.parse(searchParams.get('userConfig')) || config
}
export {  getUserConfig }