const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

//Authentication
const auth = firebase.auth();
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

// Firestore
const db = firebase.firestore();

const createThing = document.getElementById('createThing');
const thingsList = document.getElementById('thingsList');
const allThingsList = document.getElementById('allThingsList');

let thingsRef;
let unsubscribeFromUserData;
let unsubscribeFromAllChanges;

auth.onAuthStateChanged((user) => {
  if (user) {
    createThing.hidden = false;
    //get a reference to the 'things' collection
    thingsRef = db.collection('things');

    //we ask firestore for a timestamp to ensure all timestamps have the same ref
    const { serverTimestamp } = firebase.firestore.FieldValue;

    //when clicking the 'createThing' button, add a new document to the
    //collection
    //we make the logged in user own it by adding a 'uid' field with the value
    //of the user's uid
    createThing.onclick = () => {
      thingsRef.add({
        uid: user.uid,
        userDisplayName: user.displayName,
        name: faker.commerce.productName(),
        createdAt: serverTimestamp()
      });
    };

    //now, in order to see in the front-end the data from the database, we need
    //to make a query
    //making a query in firebase returns a function that can be used to
    //unsubscribe from the stream of events that happen in the back-end
    //  to get a real time stream of all the changes, use 'onSnapshot'
    //  to get the data just once, use 'get'
    unsubscribeFromUserData = thingsRef
      .where('uid', '==', user.uid) //only get the ones created by this user
      //this is obviously in no way secure; security will be configured later
      .orderBy('createdAt') //this creates a compound query because we are
      //chaining several operation on the same query
      //this will probably bring up an error and the console will give us a link
      //to create a composite index. Just follow the link and do what is suggested
      .onSnapshot((querySnapshot) => {
        //this callback function will be called on every change in the database;
        //the querySnapshot object contains an array of documents that we can
        //use to update the UI with the most recent data
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name} (${doc.data().userDisplayName})</li>`;
        });

        thingsList.innerHTML = items.join('\n');
      });

    unsubscribeFromAllChanges = thingsRef
      .orderBy('userDisplayName')
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li>${doc.data().name} (${doc.data().userDisplayName})</li>`;
        });

        allThingsList.innerHTML = items.join('\n');
      });
  } else {
    createThing.hidden = true;
    thingsList.innerHTML = '';
    allThingsList.innerHTML = '';
    //REALLY IMPORTANT!!!
    unsubscribeFromUserData && unsubscribeFromUserData(); //REALLY IMPORTANT!!!
    unsubscribeFromAllChanges && unsubscribeFromAllChanges();
  }
});
