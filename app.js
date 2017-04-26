#!/usr/bin/env node

const express = require('express');
const colors = require('colors/safe');
const moment = require('moment');
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const util = require('util');

var dir = process.cwd();
var app = express();
app.use(express.static(dir));


function log(msg, color) {
    if (color === undefined || color === null) color = colors.green;
    console.log(color('[' + moment().format('YYYY-MM-DD HH:mm:ss') + '] ') + msg);
}

app.post('/', function (req, res) {
    log('Handling post request...');
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.uploadDir = path.join(dir, moment().format('YYYY-MM-DD'));
    fs.mkdir(form.uploadDir, function () {
        form.parse(req, function (err, fields, files) {
            var f = files[''];
            if (f === undefined) f = files['files[]'];
            if (f === undefined) f = files['files'];
            if (f === undefined) f = files['file'];
            if (f) {
                if (f.constructor !== Array) f = [f];
                for (var i = 0; i < f.length; i++) {
                    f[i]['path'] = f[i]['path'].replace(dir, '').replace(/\\/g, '/');
                }
                res.json(f);
            } else {
                log('Error while handling post request.', colors.red);
                res.status(500).send();
            }
        });
    });
});

app.listen(9007, function () {
    log('Server listening on port 9007.');
});
