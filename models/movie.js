const mongoose = require('mongoose');
const config =require('../config/database');

//User schema
const MovieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director:{
        type: String,
        required: true
    },
    actors:{
        type: String,
    },
    location:{
        type: String,
        required: true
    },
    releaseDate:{
        type: String,
        required: true
    },
    budget:{
        type: String,
    },
    poster:{
        type: String,
    },
    plot: {
        type: String,
    },
    metascore: {
        type: String,
    },
    imdbId: {
        type: String,
    }
});

const Movie = module.exports = mongoose.model('Movie',MovieSchema);

module.exports.getMovieByTitle = function(title, callback){
    const query = {title: title}
    Movie.findOne(query, callback);
}

module.exports.getAllMovies = function(callback){
    //Movie.find({}, callback);
    Movie.find({},callback).sort({title: 1 });
}

module.exports.getMovie = function(id, callback){
    Movie.findById(id,callback);
}

module.exports.addMovie = function(newMovie, callback){
    newMovie.save(callback);
}

module.exports.deleteMovie = function(id, callback){
    console.log(id);
    Movie.deleteOne({_id:id},callback);
}
