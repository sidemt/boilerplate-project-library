/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
console.log("ENV", MONGODB_CONNECTION_STRING)
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client){
        let db = client.db('personal-library');
        let collection = db.collection('books');
        collection.find({}).toArray(function(err, docs){
          res.json(docs);
          db.close();
        });
      });
    })

    .post(function (req, res){
      var title = req.body.title;
      if (title && title.length){
        //response will contain new book object including atleast _id and title
        let book = {
          title: title,
          comments: [],
          commentcount: 0
        };
        MongoClient.connect(MONGODB_CONNECTION_STRING, function (err, client) {
          let db = client.db("personal-library");
          let collection = db.collection("books");
          collection.insertOne(book, function (err, doc) {
            book._id = doc.insertedId;
            res.json(book);
            db.close();
          });
        });
      } else {

      res.send('missing title');
      }
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client){
        let db = client.db('personal-library');
        let collection = db.collection('books');
        collection.findOneAndDelete({}, function(err, doc){
          if (err) {
            console.error(err);
          } else {
            res.send("complete delete successful");
          }
          db.close();
        });
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      console.log("bookid", bookid)
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client){
        let db = client.db('personal-library');
        let collection = db.collection('books');
        collection.findOne({ "_id": ObjectId(bookid) }, function(err, doc){
          if (err) {
            console.error(err);
          } else if (doc === null) {
            res.send("no book exists")
          } else {
            res.json(doc);
          }
          db.close();
        });
      });
    })

    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client){
        let db = client.db('personal-library');
        let collection = db.collection('books');
        collection.findOneAndUpdate({ "_id": ObjectId(bookid) },
          { $push: {comments: comment },
                    $inc: {commentcount: 1 }
          }, function(err, doc){
          if (err) {
            console.error(err);
          } else {
            let comments = doc.value.comments;
            comments.push(comment);
            let json = {
              "_id": doc.value._id,
              "title": doc.value.title,
              "commentcount": doc.value.commentcount + 1,
              "comments": comments
            }
            res.json(json);
          }
          db.close();
        })
      })
    })

    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, client){
        let db = client.db('personal-library');
        let collection = db.collection('books');
        collection.findOneAndDelete({ "_id": ObjectId(bookid) }, function(err, doc){
          if (err) {
            console.error(err);
          } else {
            res.send("delete successful");
          }
          db.close();
        });
      });
    });

};
