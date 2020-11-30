const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

//can be Google, Facebook, Apple...
const provider = new firebase.auth.GoogleAuthProvider();

/* 
Sign in and sign out are one time operations. These methods return a promise
and at some point, it resolves.
Authentication state, though, is something that can change multiple times during
the lifetime of the application. Usually, you want to react to those changes.
The way to do that with firebase is to add a listener to 'onAuthStateChanged'.
*/
signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged((user) => {
  if (user) {
    //use is signed in
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello, ${user.displayName}!</h3> <p> User ID: ${user.uid}</p>`;
  } else {
    //no user signed in
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = '';
  }
});
