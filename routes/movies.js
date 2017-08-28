const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const config = require('../config/database');

//Register
router.post('/postMovie',(req,res,next)=>{
    let newMovie = new Movie({
        title: req.body.title,
        director: req.body.director,
        actors: req.body.actors,
        location: req.body.location,
        releaseDate: req.body.releaseDate,
        budget: req.body.budget,
        poster: req.body.poster,
        plot: req.body.plot,
        metascore: req.body.metascore,
        imdbId: req.body.imdbId,
        rating: -1,
        nbVotes: 0
    });
    
    if(newMovie.director === ""){
        Movie.getMovieFromIMDb(req.body.imdbId, (data) =>{
            newMovie.director = data.Director;
            newMovie.actors = data.Actors;
            newMovie.poster = data.Poster;
            newMovie.location = data.Country;
            newMovie.metascore = data.Metascore;

            Movie.addMovie(newMovie, (err,movie)=>{
                if(err){
                    res.json({success:false,msg:"Failed to post the movie"});
                }else{
                    res.json({success:true,msg:"Movie posted"});
                }
            });
        });
    }else{
        Movie.addMovie(newMovie, (err,movie)=>{
        if(err){
            res.json({success:false,msg:"Failed to post the movie"});
        }else{
            res.json({success:true,msg:"Movie posted"});
        }
        });
    }
});

router.put('/updateMovie/:id',(req,res,next)=>{
    var id = req.params.id;
    Movie.updateMovie(id, req.body, (err,re) =>{
        if(err){
            res.json({success: false});
        }else{
            res.json({success: true});
        }
    })
});

router.get('/movie/:title',(req,res,next)=>{
    var title = req.params.title;
    title = title.replace("_"," ");
    
    Movie.getMovieByTitle(title, (err,movie)=>{
        if(err) throw err;
        if(!movie){
            return res.json({success:false, msg: "Movie not found"});
        }else{
            return res.json({success:true, movie: movie});
        }
    });  
});

router.delete('/deleteMovie/:id',(req,res,next)=>{
   let id = req.params.id;
    Movie.deleteMovie(id , (err)=>{
        if(err){
            return res.json({success:false, msg: "Movie hasn't been removed"});
        }else{
            return res.json({success:true, msg: "Movie has been removed"});
        }
    });  
});

router.get('/movies',(req,res,next)=>{
   
    Movie.getAllMovies( (err,movies)=>{
        if(err) throw err;
        if(!movies){
            return res.json({success:false, msg: "Movies not found"});
        }else{
            return res.json({success:true, movies: movies});
        }
    });  
});

router.get('/movieById/:id',(req,res,next)=>{
    Movie.getMovie(req.params.id, (err,movie)=>{
        if(err) throw err;
        if(!movie){
            return res.json({success:false, msg: "Movie not found"});
        }else{
            return res.json({success:true, movie: movie});
        }
    });  
});

/******************API OMDb*******************/
router.get('/movieFromIMDb/:id',(req,res,next)=>{
    Movie.getMovieFromIMDb(req.params.id, (data) =>{
        res.json(data);
    });
});

router.get('/searchFromIMDb',(req,res,next)=>{
    
    let param = {
        search: req.query.search,
        type: req.query.type,
        year: req.query.year
    }
    Movie.searchMovieFromIMDb(param, (data) =>{
        res.json(data);
    });
});

/*****************API The Movie Db ***************/
router.get('/movieFromTMDb/:id',(req,res,next)=>{
    let param = {
        id: req.params.id,
        type: req.query.type
    }


    Movie.getMovieFromTMDb(param, (data) =>{
        res.json(data);
    });
});

router.get('/searchFromTMDb',(req,res,next)=>{
    
    let quer = req.query.query.split(' ').join('+');

    let param = {
        query: quer,
        year: req.query.year,
        type: req.query.type
    }
    Movie.searchMovieFromTMDb(param, (data) =>{
        res.json(data);
    });
});
/***************************************/
router.get('/videos/:id',(req,res,next)=>{
    let id = req.params.id;
    Movie.getVideosMovie(id, (data) =>{
        res.json(data);
    });
});

router.get('/stats-1',(req,res,next)=>{

    Movie.getBestRating((err, bestRatingMovies) =>{
        if(!err){
            Movie.getMostRated((error, mostRatedMovies) =>{
                if(!error){
                    res.json({
                        bestRatingMovies,
                        mostRatedMovies
                    })
                }
            });
        }
    });
});

router.get('/stats',(req,res,next)=>{
    Movie.getStats((err,resu)=>{
        let resulats = {
            bestRatingMovies: resu[0],
            mostRatedMovies: resu[1],
            numberMovies: resu[2]
        }
        res.json(resulats);
    });
});

module.exports = router; 