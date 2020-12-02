# Firebase basics

Following fireship's Firebase basics video.

https://www.youtube.com/watch?v=q5J5ho7YUhA&ab_channel=Fireship

## 1 Create firebase project

Go to firebase and create a new project. Once done, add a new app (web app in
this case). A firebase project can have several project, so give each app a
proper nickname.

After registering the new app, you will get the firebase credentials to link the
web app to this firebase project. These can totally be exposed since they don't
contain any confidential information.

## 2 HTML

Open your code editor of choice, create a folder called **public**, and inside
it, create a file called **index.html**.

The script tag obtained from firebase contains _TODO_'s, to add SDKs for the
different products firebase has to offer (**Auth**, storage, **Firestore**...).
Firebase is modular, which means we can opt in to progressively enhance our app
with the features that we want to use. Not including features we don't use means
we will have less dead code that would degrade performance.

In this case we want the SDKs for **Auth** and **Firestore**.

## 3 app.js

Create a file called **app.js** inside the **public** folder. Create a _script_
tag in the HTML file, at the end of the _body_ tag, with the **defer**
attribute.

If we were to print _firebase_ to the log from **app.js**, we should be able to
see something in the console:

`console.log(firebase)`

## 4 Install Firebase CLI

It is also recommended to install the VS Code extension _Firebase Explorer_.

```
npm i -g firebase-tools
firebase login
firebase init
```

When initializing firebase, it will ask what features to use: for the moment,
let's just choose hosting and emulators. When asked about which emulators, for
the moment just choose hosting and the default options that come for the
subsequent questions.

These actions created two files (without counting _.gitignore_): _.firebaserc_
and _firebase.json_.

### .firebaserc

This is a resource configuration file. It contains an identifier for our
project.

### firebase.json

This one can be modified to adjust the behavior of several firebase services.

## Serving

To run the app locally:

`firebase serve`

or

`firebase emulators:start`

## Deployment

Run:

`firebase deploy`

It will take the files in the **public** folder and upload them to the firebase
hosting server.

## Authentication

In the firebase console, go to the **Authentication** tab. You can manually add
users, or you can also enable some sign-in methods.

For this project, we will use Google authentication method.

Add a few elements in the HTML (see _authentication_ comments).

After doing, we move on to the .js and get the Auth SDK and enable 'Sign in with
Google'.

## Firestore

NoSQL document oriented database segmented in collections.

Add some HTML to show the contents from the firestore database.

Then in the JavaScript, create a reference to the firestore database:

`const db = firebase.firestore()`

When accessing data from the database in real time, two things are needed:

1. A reference to the document or collection.
2. Because we are reading data in real time, our front-end will react to changes
   in the database. This means we will be subscribed to a stream of changes that
   happen to the database. We need to be able when to stop listening to those
   changes, hence we create another variable for that (let's call it
   _unsubscribe_)

Follow along with the changes in the JavaScript under the comment **Firestore**.

## Security

Even though in the Javascript we are only retrieving the data created by the
logged in user, that is not secure at all. Somebody else still has access to
absolutely everything in the database.

Full-stack security rules are critical! Go to **Rules** tab from the Firestore
console.

First, to secure the entire database:

```
match /{document=**} {
  allow read, write: if false;
}
```

Things will be allowed selectively depending on where they are needed. Then we
reference the things collection and add the following:

```
match /things/{docId} {
  allow write: if request.auth.uid == request.resource.data.uid;
  allow read: if request.auth.uid == resource.data.uid;
}
```

The `request.auth.uid` element refers to the logged in user present in the
request sent to firebase. The `request.resource.data` element refers to the
resource we want to create, which is part of the request sent to firebase. In
the read part, the same applies, only that `resource.data` is a reference to the
element that the front-end is trying to read.

In the end, it was made such that users can see who has what, users can add
items to their own collection, and users can delete items only from their
collection. For that, the previously mentioned rules were modified to:

```
match /things/{docId} {
  allow write: if request.auth.uid == request.resource.data.uid;
  allow delete: if request.auth.uid == resource.data.uid;
  allow read: if request.auth.uid != null;
}
```

**NOTE**: when deleting, we are checking against `resource.data.uid`, because we
are trying to delete an element already present in the database.
