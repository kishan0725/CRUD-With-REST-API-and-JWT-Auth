const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');
const Post = require('../models/Posts');

// read all the posts
router.get("/all", verify, async (req, res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    } catch(err) {
        res.status(404).send(`Unable to process your request - ${err}`);
    }
});

// read the user's post who is current logged in
router.get("/", verify, async (req, res) => {
    try{
        const posts = await Post.findOne({_id:req.user._id});
        res.json(posts);
    } catch(err) {
        res.status(404).send(`Unable to process your request - ${err}`);
    }
});

// create a post
router.post("/", verify, async (req, res) => {
    const post = new Post({
        _id: req.user._id,
        title: req.body.title,
        desc: req.body.desc
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch(err) {
        res.status(404).send(`Unable to Post! ${err}`);
    }
});

// read a specific post
router.get('/:postId', verify, async (req, res) => {
    try {
        const mypost = await Post.findById(req.params.postId);
        res.json(mypost);
    } catch(err) {
        res.status(404).send(`Unable to Get Post! ${err}`);
    }    
});

// update a post
router.patch('/:postId', verify, async (req, res) => {
    try {
        const updatepost = await Post.findById(req.params.postId);
        updatepost.title = req.body.title
        const updated = await updatepost.save();
        res.json(updated);
    }
    catch(err){
        res.status(404).send(`Unable to Get Post! ${err}`);
    }
});

// delete a post
router.delete('/:postId', verify, async (req, res) => {
    try {
        Post.deleteOne({"_id":req.params.postId})
            .then(() => {
                res.send("Deleted Successfully!");
            })
            .catch(err => res.send(err));
    }
    catch(err){
        res.status(404).send(`Unable to Get Post! ${err}`);
    }
});

module.exports = router;