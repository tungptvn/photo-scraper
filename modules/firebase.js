//init firebase
const firebaseConfig = {
  apiKey: "AIzaSyC5UwywaIF_-jT84_dXjveyOrvsr1XVOWo",
  authDomain: "photo-f297d.firebaseapp.com",
  databaseURL: "https://photo-f297d.firebaseio.com",
  projectId: "photo-f297d",
  storageBucket: "photo-f297d.appspot.com",
  messagingSenderId: "1075334647490",
  appId: "1:1075334647490:web:8639a072c87922ac5af55b"
};
export function initfirebase() {

  firebase.initializeApp(firebaseConfig);
}