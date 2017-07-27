const express = require('express');
const path = require ('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose =require('mongoose');
const config =require('./config/database');

mongoose.connect(config.database, {useMongoClient: true});

mongoose.connection.on('connected',()=>{
    console.log("connected to DB");
});

mongoose.connection.on('error',(err)=>{
    console.log("Error" + err);
});

const app = express();

const users = require('./routes/users');
const movies = require('./routes/movies');
const comments = require('./routes/comments');
const ips = require('./routes/ips');

//const port = process.env.PORT || 8080;
const port = 3008;
//Cors midlleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Body parser middleware
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users',users);
app.use('/movies',movies);
app.use('/comments',comments);
app.use('/ips',ips);

//Index route
app.get('/',(req,res) => {
    res.send('Invalid Endpoint');
});

app.get('*',(req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

//Start server
app.listen(port, () =>{
    console.log('Server started on port' + port);
});