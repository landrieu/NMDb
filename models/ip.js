const mongoose = require('mongoose');
const config =require('../config/database');
const http = require('http');

const IPSchema = mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    country:{
        type: String,
    },
    countryCode:{
        type: String,
    },
    region:{
        type: String,
    },
    regionName:{
        type: String,
    },
    city:{
        type: String,
    },
    zip:{
        type: String,
    },
    lat:{
        type: String,
    },
    lon:{
        type: String,
    },
    date:{
        type: Date,
    },
});

const IP = module.exports = mongoose.model('IP',IPSchema);

module.exports.findLocationIP = function(IP, callback){
    if(IP !== "::ffff:127.0.0.1" && IP!== "::1"){
            var options = { 
                hostname: 'ip-api.com',
                headers: { 'Content-Type': 'application/json' },
                path: "/json/" + IP,
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
   }else{
       callback({
           status: "locale"
       });
   }

}


module.exports.storeIP = function(IP, callback){
    IP.save(callback);
}