const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

const express = require('express'); 
const app = express();

app.get('/posts', (req, res) => {
  db.collection('posts')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let posts = [];
      data.forEach(doc => {
        posts.push({
          postId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
});

app.post('/posts', (req, res) => {
  const newPost = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };
    db.collection('posts')
      .add(newPost)
      .then(doc => {
        return res.json({ message: `document ${doc.id} created successfully` });
      })
      .catch(error => {
        res.status(500).json({ error: 'something went wrong' });
      });
});

exports.api = functions.https.onRequest(app); 