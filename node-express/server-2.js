/*
* @Author: GaNeShKuMaRm
* @Date:   2017-02-24 22:30:34
* @Last Modified by:   GaNeShKuMaRm
* @Last Modified time: 2017-02-24 22:32:30
*/

'use strict';

var express = require('express');
var morgan = require('morgan');

var hostname = "localhost";
var port = 3000;

var app = express();

app.use(morgan('dev'));

app.use(express.static(__dirname + '/public'));

app.listen(port, hostname, function() {
    console.log(`Server running at http://${hostname}:${port}`);
});