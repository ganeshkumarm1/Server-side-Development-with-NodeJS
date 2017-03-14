/*
* @Author: GaNeShKuMaRm
* @Date:   2017-02-28 17:51:22
* @Last Modified by:   GaNeShKuMaRm
* @Last Modified time: 2017-03-15 00:08:59
*/

'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dishes = require('../models/dishes');
var dishRouter = express.Router();
var Verify = require('./verify');

dishRouter.route('/')
.get(Verify.verifyOrdinaryUser,  function(req, res, next) {
    Dishes.find({}, function(err, dish) {
        if (err) throw err;
        res.json(dish);
    });
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Dishes.create(req.body, function(err, dish) {
        if(err) throw err;
        console.log('Dish created!');
        var id = dish._id;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Added the dish with id: ' + id);
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Dishes.remove({}, function(err, resp) {
        if(err) throw err;
        res.json(resp);
    });
})

dishRouter .route('/:dishId')
.get(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        if(err) throw err;
        res.json(dish);
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin,function(req, res, next) {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
        },
        {
            new: true
        },
        function(err, dish) {
            if(err) throw err;
            res.json(dish);
        });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Dishes.remove(req.params.dishId, function(err, resp) {
        if(err) throw err;
        res.json(resp);
    });
});

dishRouter.route('/:dishId/comments')
.get(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        if(err) throw err;
        res.json(dish.comments);
    })
})
.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        if(err) throw err;
        dish.comments.push(req.body);
        dish.save(function(err, dish) {
            if(err) throw err;
            res.json(dish);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        if(err) throw err;
        for(var i = (dish.comments.length - 1); i >= 0; i --)
        {
            dish.comments.id(dish.comments[i]._id).remove();
        }
        dish.save(function(err, result) {
            if(err) throw err;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Deleted all comments');
        })
    });
});

dishRouter.route('/:dishId/comments/:commentId')
.get(function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        if(err) throw err;
        res.json(dish.comments.id(req.params.commentId));
    });
})
.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin,function(req, res, next) {
    Dishes.findById(req.params.dishId, function(err, dish){
        if(err) throw err;
        dish.comments.id(req.params.commentId).remove();
        dish.comments.push(req.body);
        dish.save(function(err, dish) {
            if (err) throw err;
            res.json(dish);
        });
    });
})
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin,function(req, res,next) {
    Dishes.findById(req.params.dishId, function(err, dish) {
        dish.comments.id(req.params.commentId).remove();
        dish.save(function(err, resp) {
            if(err) throw err;
            res.json(resp);
        });
    });
});
module.exports = dishRouter;