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
