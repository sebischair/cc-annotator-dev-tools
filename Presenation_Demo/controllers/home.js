var Project = require('../models/Project');
var formidable = require('formidable');
var User = require('../models/User');
var cloudinary = require('cloudinary');
/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  Project.getAllProjects(function(error, projects) {
    res.render('index',{
      title: 'Home',
      projects: projects,
      cloudinary: cloudinary
    })
  });
};

function isOceans(value){
  var that = this;
    return value == 11;
}

exports.test = function(req, res) {
  Project.getAllProjects(function(error, projects) {
    res.render('index',{
      title: 'Test',
      projects: projects,
      cloudinary: cloudinary
    })
  });
};
