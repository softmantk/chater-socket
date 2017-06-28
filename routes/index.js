var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var Post = mongoose.model('Post');
var colors = require("colors");
function isAuthenticated (req, res, next) {
    if(req.method === "GET"){

        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }
    return res.redirect('/login');
}

router.get('/', function(req, res, next) {
    var rec_chats;

    Post.find(function(err, posts){
        if(err){
            return res.send(500, err);
        }
        rec_chats = posts;
    /*    console.log("************************************************\n"+req.user)
        console.log("************************************************\n")
        console.log("Posts: "+typeof  posts);*/

        res.render('index', { title: "Chirp", chats: posts, user :req.user});
    });

});
router.get('/login', function (req, res) {
    res.render('login', { title: "Chirp", error_message:"", user :req.user});
});
router.get('/signup',function (req, res) {
    res.render('register',{error_message:"", user :req.user});
});

router.route('/posts')
//creates a new post
    .post(isAuthenticated,  function(req, res){

        var post = new Post();
        post.text = req.body.text;
        post.created_by = req.user.username;
        post.save(function(err, post) {
            if (err){
                return res.send(500, err);
            }
            return res.redirect('/');
        });
    });
router.route('/posts/:id')
//gets specified post
    .get(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });
    })
    //updates specified post
    .put(function(req, res){
        Post.findById(req.params.id, function(err, post){
            if(err)
                res.send(err);

            post.created_by = req.user.username;
            post.text = req.body.text;

            post.save(function(err, post){
                if(err)
                    res.send(err);

                res.json(post);
            });
        });
    })
    //deletes the post
    .delete(function(req, res) {
        Post.remove({
            _id: req.params.id
        }, function(err) {
            if (err)
                res.send(err);
            res.json("deleted :(");
        });
    });

module.exports = router;
