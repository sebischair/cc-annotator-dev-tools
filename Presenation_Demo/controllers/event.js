var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var Event = require('../models/Event');
var Project = require('../models/Project');
var secrets = require('../config/secrets');
var Project = require('../models/Project');
var formidable = require('formidable');
var User = require('../models/User');
var cloudinary = require('cloudinary');
var mongoose = require('mongoose');


/**
 * GET /:channel/material
 * 
 */
exports.getEvent = function(req, res) {

    res.render('userEvents',{
      title: 'Events'});
};

/**
 * GET /:channel/materials
 * 
 */
exports.getEvents = function(req, res) {
	
	if (req.user == 'undefined' || req.user == '' || req.user == null){
		Event.find({$or : [{"channel":"PUBLIC"}]}, function(err, events){
			res.send(events);
		});
		return;
	}

	Event.find({$or : [{"channel":"PUBLIC"},{"channel":req.user.channel},{creator: req.user._id}]}, function(err, events){
		res.send(events);
	});
	return;
};
