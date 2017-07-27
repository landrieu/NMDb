const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const IP = require('../models/ip');
const config = require('../config/database');

router.post('/postIP', (req, res, next) => {

    IP.findLocationIP(req.connection.remoteAddress, (data) =>{
        if(data.status === 'success'){

            let newIP = new IP({
                    address: data.query,
                    country: data.country,
                    countryCode: data.countryCode,
                    region: data.region,
                    regionName: data.regionName,
                    city: data.city,
                    zip: data.zip,
                    lat: data.lat,
                    lon: data.lon,
                    date: new Date()
            });

            IP.storeIP(newIP, (err,rep) =>{
                if(err){
                    res.json({success: false});
                }else{
                    res.json({success: true});
                }

            });
        }else{
            res.json({
                success: false
            });
        }
    });
});

module.exports = router;