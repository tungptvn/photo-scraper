const config = {
    timeDelay: 0,
    url: '',
    pFrom: 0, pTo: 10,
    pageTemplate: 'page-__pageNum__',
    filter: 'http',
    isFree: false
    //pageTemplate: '&page=__pageNum__'
}

function getUserConfig() {
    var searchParams = new URLSearchParams(window.location.search);
    return JSON.parse(searchParams.get('userConfig')) || config
}
export {  getUserConfig }