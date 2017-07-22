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
            res.json({success:true,msg:"Comment posted"});
        }
    })  
});

router.get('/commentsUser/:userId',(req,res,next)=>{
    var userId = req.params.userId;
    
    Comment.getCommentsByUserId(userId, (err,comments)=>{
        if(err) throw err;
        if(!comments){
            return res.json({success:false, msg: "Comments not found"});
        }else{
            return res.json({success:true, comments: comments});
        }
    });  
});

router.get('/commentsMovie/:idMovie',(req,res,next)=>{
    var idMovie = req.params.idMovie;
    
    Comment.getCommentsByMovieId(idMovie, (err,comments)=>{
        if(err) throw err;
        if(!comments){
            return res.json({success:false, msg: "Comments not found"});
        }else{
            return res.json({success:true, comments: comments});
        }
    });  
});

module.exports = router;
