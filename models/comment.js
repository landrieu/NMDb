const mongoose = require('mongoose');
const config =require('../config/database');
const http = require('http');

const CommentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    },
    username:{
        type: String,
    },
    idUser:{
        type: String,
        required: true
    },
    idMovie:{
        type: String,
        required: true
    },
    titleMovie:{
        type: String,
    },
    date:{
        type: Date,
    },
});

const Comment = module.exports = mongoose.model('Comment',CommentSchema);


module.exports.addComment = function(newComment, callback){
    newComment.save(callback);
}



