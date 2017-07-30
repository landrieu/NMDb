const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const IP = require('../models/ip');
const config = require('../config/database');

router.post('/postIP', (req, res, next) => {

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let ip2 = req.headers["x-forwarded-for"];
    if (ip2) {
        var list = ip2.split(",");
        ip2 = list[list.length - 1];
    }
    console.log(req.ip);

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
                        ip: req.connection.remoteAddress,
                        msg: "Db problem",
                        err: err,
                        other: req.ip,
                        ip2: ip2
                    });
                } else {
                    res.json({
                        success: true,
                        ip: req.connection.remoteAddress,
                        msg: "OK"
                    });
                }

            });
        } else {
            res.json({
                success: false,
                ip: req.connection.remoteAddress,
                msg: "Locale",
                other: req.ip, 
                ip2: ip2
            });
        }
    });
});

module.exports = router;