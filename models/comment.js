const mongoose = require('mongoose');
const config = require('../config/database');
const http = require('http');

const CommentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    idUser: {
        type: String,
        required: true
    },
    idMovie: {
        type: String,
        required: true
    },
    titleMovie: {
        type: String,
    },
    date: {
        type: Date,
    },
});

const Comment = module.exports = mongoose.model('Comment', CommentSchema);


module.exports.addComment = function (newComment, callback) {
    newComment.save(callback);
}

module.exports.getComments = function (callback) {
    Comment.find(callback);
}

module.exports.getCommentsByMovieId = function (id, callback) {
    Comment.find({ idMovie: id }, callback);
}

module.exports.getCommentsByUserId = function (id, callback) {
    Comment.find({ idUser: id }, callback);
}

module.exports.deleteComment = function (id, callback) {
    Comment.deleteOne({ _id: id }, callback);
}

module.exports.getStats = function (callback) {

    var numberComments = new Promise((resolve, reject) => {
        resolve(Comment.count());
    });

    var err = false;

    Promise.all([numberComments]).then(values => {
        callback(err, values);
    });

}




