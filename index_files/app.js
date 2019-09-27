(function () {
  log = () => console.log
  init()
  bindEvents()
  app()
  function init() {
    //init firebase
    var firebaseConfig = {
      apiKey: "AIzaSyC5UwywaIF_-jT84_dXjveyOrvsr1XVOWo",
      authDomain: "photo-f297d.firebaseapp.com",
      databaseURL: "https://photo-f297d.firebaseio.com",
      projectId: "photo-f297d",
      storageBucket: "photo-f297d.appspot.com",
      messagingSenderId: "1075334647490",
      appId: "1:1075334647490:web:8639a072c87922ac5af55b"
    };
    firebase.initializeApp(firebaseConfig);
  }
  function bindEvents() {
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
  function app() {
    var searchParams = new URLSearchParams(window.location.search);
    var isQueryDoc = searchParams.has("doc")
    if (isQueryDoc) {
      var collection = searchParams.get("collection"),
        doc = searchParams.get("doc"),
        field = searchParams.get("field")
    }
    firebase.firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(imgsDb => imgsDb.data())
      .then(data => { console.log(data); return data[field] })
      .then(imgs => {
        render(imgs.split(','))
      })
  }
  function render(imgs) {
    if (imgs.length == 0) return
    $('.Images').html('')
    imgs.map(x => $(`<div class="Image">
                      <div class="Image-overlay"></div>
                      <img src="${x}" data-zoom="${x}" alt="">
                    </div>`))
      .map(img => $('.Images').append(img))
  }


})()
