const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const IP = require('../models/ip');
const config = require('../config/database');

router.post('/postIP', (req, res, next) => {

    let ip = req.headers["x-forwarded-for"];
    if (ip) {
        var list = ip.split(",");
        ip = list[list.length - 1];
    }

    if(ip){

    ip = ip.replace(/\s/g, '');

    IP.findLocationIP(ip, (data) => {
        if (data.status === 'success') {

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

            IP.storeIP(newIP, (err, rep) => {
                if (err) {
                    res.json({
                        success: false,
                        ip: ip,
                        msg: "Db problem",
                        err: err,
                    });
                } else {
                    res.json({
                        success: true,
                        ip: ip,
                        msg: "OK"
                    });
                }

            });
        } else {
            res.json({
                success: false,
                msg: "Locale",
                ip: ip
            });
        }
    });
    }
});

module.exports = router;