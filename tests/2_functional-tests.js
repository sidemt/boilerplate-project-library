/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: 'Test Title'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'response should contain title');
          assert.property(res.body, '_id', 'response should contain _id');
          done();
        });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: ''})
        .end(function(err, res){
          assert.equal(res.text, 'missing title');
          done();
        })
      });
    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books/')
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/5f00f8d2e2b54b54646cac19')
        .end(function(err, res){
          assert.equal(res.text, 'no book exists');
          done();
        })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get('/api/books/5f01286336aed046ecd380b3')
        .end(function(err, res){
          assert.equal(res.body.title, 'new book', 'Title should be in the response');
          assert.equal(res.body._id, '5f01286336aed046ecd380b3', '_id should be in the response');
          assert.property(res.body, 'comments', 'comments property should exist');
          assert.isArray(res.body.comments, 'comments should be an array');
          done();
        })
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post('/api/books/5f01286336aed046ecd380b3')
        .send({
          comment: "Comment posted by test"
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'title', 'response should contain title');
          assert.property(res.body, '_id', 'response should contain _id');
          assert.property(res.body, 'commentcount', 'response should contain commentcount');
          assert.property(res.body, 'comments', 'response should contain comments');
          assert.isArray(res.body.comments, 'comments should be an array');
          done();
        })

        //done();
      });

    });

  });

});
