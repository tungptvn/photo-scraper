
import {  runForum } from './modules/photo-forum.js';
import { runFree } from './modules/photo-free.js'
import { bindModalEvent } from'./modules/event-modal.js';
import { initfirebase } from './modules/firebase.js';
import { getUserConfig } from './modules/config.js'
init()
bindEvents()
app()
function init() {
  initfirebase()
}
function bindEvents() {
  bindModalEvent()

  document.getElementById('userConfig').value = JSON.stringify(  getUserConfig(), undefined, 4);

  $(document).ready(function () {
    $('.ipImgs').change(function () {
      var imgs = []
      if (this.value.charAt(0) === '[')
        imgs = JSON.parse(this.value)
      else
        imgs = this.value.split(',')
      render(imgs)
    })
    $('.ipImgs').dblclick(function () {
      navigator.clipboard.readText().then(clipText => {
        this.value = clipText
        $('.ipImgs').trigger('change')
      })
    })
  });

  
}
async function app() {
  var searchParams = new URLSearchParams(window.location.search);
  var isQueryDoc = searchParams.has("doc")
  if (isQueryDoc) {
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
  if(searchParams.has('userConfig')){
    var rs = ''
    if(getUserConfig().isFree){
      rs = await runFree()
    }
    else
    rs = await runForum()
    render(rs.split(','))
  }

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

