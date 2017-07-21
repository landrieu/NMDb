const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const config = require('../config/database');

//Register
router.post('/postComment',(req,res,next)=>{
    console.log("BIU");
    let newComment = new Comment({
        title: req.body.title,
        text: req.body.text,
        username: req.body.username,
        idUser: req.body.idUser,
        idMovie: req.body.idMovie,
        titleMovie: req.body.titleMovie,
        date: new Date()
    });

    Comment.addComment(newComment, (err,comment)=>{
        if(err){
            res.json({success:false,msg:"Failed to post the comment"});
        }else{
            // Add ID Comment to User and 
            //res.json(comment._id);
            res.json({success:true,msg:"Comment posted"});
        }
    })  
});

router.get('/commentByUserId/:userId',(req,res,next)=>{
    var userId = req.params.userId;
    
    Comment.getCommentByUserId(userId, (err,comment)=>{
        if(err) throw err;
        if(!comment){
            return res.json({success:false, msg: "Comment not found"});
        }else{
            return res.json({success:true, comment: comment});
        }
    });  
});

router.get('/commentByMovieId/:userId',(req,res,next)=>{
    var movieId = req.params.movieId;
    
    Comment.getCommentByMovieId(movieId, (err,comment)=>{
        if(err) throw err;
        if(!comment){
            return res.json({success:false, msg: "Comment not found"});
        }else{
            return res.json({success:true, comment: comment});
        }
    });  
});

module.exports = router;
