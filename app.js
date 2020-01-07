
import {  runForum } from './modules/photo-forum.js';
import { runFree } from './modules/photo-free.js'
import { bindModalEvent } from'./modules/event-modal.js';
import { initfirebase } from './modules/firebase.js';
import { getUserConfig } from './modules/config.js'
import { render } from './modules/utils.js'
init()
bindEvents()
app()
function init() {
  initfirebase()
}
function bindEvents() {
  bindModalEvent()
  var uCf = Object.assign({}, getUserConfig());
  delete uCf.origin

  document.getElementById('userConfig').value = JSON.stringify(  uCf, undefined, 4);

  $(document).ready(function () {
   
    $('.ipImgs').dblclick(function () {
      navigator.clipboard.readText().then(clipText => {
        this.value = clipText
      })
    })
  });

  
}
async function app() {
  var searchParams = new URLSearchParams(window.location.search);
  var isQueryDoc = searchParams.has("doc") && searchParams.get("doc")
  var ishasSource = searchParams.has("imgsSource") && searchParams.get("imgsSource")
  if(ishasSource){
    var imgs = searchParams.get("imgsSource")
    render(imgs.split(','))
  } 
  else if (isQueryDoc) {
    var collection = searchParams.get("collection"),
      doc = searchParams.get("doc"),
      field = searchParams.get("field");
    firebase.firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(imgsDb => imgsDb.data())
      .then(data => data[field])
      .then(imgs => {
        render(imgs.split(','))
      })
  }
  else if(searchParams.has('userConfig')){
    var rs = ''
    if(getUserConfig().isFree){
      rs = await runFree()
    }
    else
    rs = await runForum()
    //render(rs.split(','))
  }

}