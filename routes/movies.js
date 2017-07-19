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
        imdbId: req.body.imdbId
    });

    Movie.addMovie(newMovie, (err,movie)=>{
        if(err){
            res.json({success:false,msg:"Failed to post the movie"});
        }else{
            res.json({success:true,msg:"Movie posted"});
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


module.exports = router;