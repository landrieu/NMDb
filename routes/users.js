const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');


//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        registrationDate: new Date(),
        lastConnection: undefined,
        birthDate: null,
        likedMovies: [],
        ratedMovies: [],
        placesToSee: [],
        placesSeen: [],
        description: "",
        comments: []
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: "Failed to register user" });
        } else {
            res.json({ success: true, msg: "User registered" });
        }
    })
});

//Authentication
router.post('/authenticate', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;

        if (!user) {
            return res.json({ success: false, msg: "User not found" });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 //1 week
                });

                user.lastConnection = new Date();
                User.updateUser(user, user._id, (err)=>{
                    if(err){
                        console.log("err");
                    }
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({ succes: false, msg: "Wrong Password" });
            }
        })
    })
});

router.get('/users', (req, res, next) => {
    User.getUsers((err, users) =>{
        res.json({users: users});
    })
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

router.get('/user/:id', (req, res, next) => {
    User.getUserById( req.params.id ,(err, user) => {
        if (err) {
            res.json({ success: false, msg: "Failed to get user" });
        } else {
            res.json(user);
        }
    });
});

router.get('/number', (req, res, next) => {
    User.getNumberUsers((err, number) => {
        if (err) {
            res.json({ success: false, msg: "Failed to get number of users" });
        } else {
            res.json(number);
        }
    });
});

router.patch('/edit/addContentProfile/:id', (req, res, next) => {
    let type = req.body.type;
    let data = req.body;

    User.getUserById(req.params.id, (err, user) => {
        if (err) {
            res.json({ success: false, msg: "Failed to add liked Movie" });
        } else {
            if (type === "likedMovie") {
                let likedMovies = user.likedMovies;
                let movie = {
                    id: data.id,
                    title: data.title,
                }
                likedMovies.push(movie);

                let param = {
                    likedMovies: likedMovies,
                    userId: user.id
                }

                User.addLikedMovie(param, (err, count, status) => {
                    if (err) {
                        res.json({ success: false, msg: "Failed to add liked movie" });
                    } else {
                        res.json({ success: true, msg: "Liked movie added" });
                    }
                });

            }
            if (type === "ratedMovie") {
                let ratedMovies = user.ratedMovies;
                let movie = {
                    id: data.id,
                    title: data.title,
                    rate: data.rate
                }

                ratedMovies.push(movie);

                let param = {
                    ratedMovies: ratedMovies,
                    userId: user.id
                }

                User.addRatedMovie(param, (err, count, status) => {
                    if (err) {
                        res.json({ success: false, msg: "Failed to add rated movie" });
                    } else {
                        res.json({ success: true, msg: "Rated movie added" });
                    }
                });

            }
            if (type === "placesSeen") {

            }
            if (type === "placesToSee") {

            }
            //console.log(type);
            // res.send(user);
        }
    });





    /*User.editUser(newUser, (err,user)=>{
        if(err){
            res.json({success:false,msg:"Failed to edit user"});
        }else{
            res.json({success:true,msg:"User registered"});
        }
    })*/
});

router.patch('/edit/updateProfile/:id', (req, res, next) => {

    let param = {
        name: req.body.name,
        email: req.body.email,
        birthDate: req.body.birthDate,
        description: req.body.description,
        id: req.params.id
    }
    User.updateProfile(param, (err, count, status) => {
        if (err) {
            res.json({ success: false, msg: "Failed to update profile" });
        } else {
            res.json({ success: true, msg: "Profile updated" });
        }
    });
});

router.patch('/edit/addPlace/:id', (req, res, next) => {

    let id = req.params.id;

    let param = {
        timeStamp: req.body.timeStamp,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        title: req.body.title,
        seen: req.body.seen,
        address: req.body.address
    }

    User.addPlace(param, id, (err, count, status) => {
        if (err) {
            res.json({ success: false, msg: "Failed to add place" });
        } else {
            res.json({ success: true, msg: "Place added" });
        }
    });
});

router.patch('/edit/deletePlace/:id', (req, res, next) => {

    let id = req.params.id;

    let param = {
        timeStamp: req.body.timeStamp,
        type: req.body.type
    }

    User.deletePlace(param, id, (err, count, status) => {
        if (err) {
            res.json({ success: false, msg: "Failed to delete place" });
        } else {
            res.json({ success: true, msg: "Place deleted" });
        }
    });
});

router.put('/user/:id', (req, res, next) => {
    let id = req.params.id;

    let user = {
        _id: req.body._id,
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        registrationDate: req.body.registrationDate,
        birthDate: req.body.birthDate,
        likedMovies: req.body.likedMovies,
        ratedMovies: req.body.ratedMovies,
        placesToSee: req.body.placesToSee,
        placesSeen: req.body.placesSeen,
        description: req.body.description,
    }

    User.updateUser(user, id, (err, count, status) => {
        if (err) {
            res.json({ success: false, msg: "Failed to update the user" });
        } else {
            res.json({ success: true, msg: "User updated" });
        }
    });
});




module.exports = router;