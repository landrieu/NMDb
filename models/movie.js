const mongoose = require('mongoose');
const config =require('../config/database');
const http = require('http');

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

module.exports.getMovieFromIMDb = function(id,callback){
    //const query = {title: title}
    var options = { 
        hostname: 'www.omdbapi.com',
        path: '/?i=' + id + '&apikey=' + config.OMDb_API_KEY + '&plot=full',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };
    
    call = function(response) {
    var str = '';

    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        callback(JSON.parse(str));
    });
    }

    http.request(options, call).end();
};

module.exports.searchMovieFromIMDb = function(param,callback){

    var options = { 
        hostname: 'www.omdbapi.com',
        path: '/?s=' + param.search + '&apikey=' + config.OMDb_API_KEY + '',//+ '&y=' + param.year + '&type=' + param.type,
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };
    
    call = function(response) {
    var str = '';

    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        callback(JSON.parse(str));
    });

    response.on('error', function () {
        let back = {
            success: false,
            msg: "Error from Database"
        }
        callback(back);
    });
    }

    http.request(options, call).end();
};







