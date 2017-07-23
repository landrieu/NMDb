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
    },
    actors:{
        type: String,
    },
    location:{
        type: String,
    },
    releaseDate:{
        type: String,
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
        path: '/?s=' + param.search + '&apikey=' + config.OMDb_API_KEY + '',
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
/****************TMDb********************/
module.exports.searchMovieFromTMDb = function(param,callback){
    console.log(param.query);
    var options = { 
        hostname: 'api.themoviedb.org',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };

    if(param.type === "series"){
        options.path = '/3/search/tv?api_key=' + config.TMDb_API_KEY + '&query=' + param.query + '&year=' + param.year;
    }else{
        options.path = '/3/search/movie?api_key=' + config.TMDb_API_KEY + '&query=' + param.query + '&year=' + param.year;
    }

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

module.exports.getMovieFromTMDb = function(param,callback){

    var options = { 
        hostname: 'api.themoviedb.org',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };

    if(param.type === "series"){
        options.path = '/3/tv/' + param.id + '?api_key=' + config.TMDb_API_KEY;
    }else{
        options.path = '/3/movie/' + param.id + '?api_key=' + config.TMDb_API_KEY;
    }
    
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





