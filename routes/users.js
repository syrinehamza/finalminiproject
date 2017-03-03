var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
let Project = require('../models/Project');
let Work = require('../models/Work');


var User = require('../models/user');

//Ask visitor or student
router.get('/homepage', function(req,res){
        
        Project.find(function(err, projects){
            
            if(err)
                res.send(err.message);
            else
                res.render('index', {projects});
        })
});


// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	//var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	// req.checkBody('email', 'Email is required').notEmpty();
	// req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			//email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});


passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/studentpage', function(req,res){
Project.find(function(err, projects){
            if(err)
                res.send(err.message);
            else
                res.render('studentPage', {projects});
        })	});


router.post('/login',
  passport.authenticate('local', {successRedirect:'/users/studentpage', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/homepage'); 
});

//

//get portfolio creation page 
router.get('/createPortfolio', function(req, res){
	res.render('createportfolio');
});



//creation of portfolio


router.post('/createPortfolio',function(req, res){
       //let project = new Project(req.body);

			//  var name = NAME;
			//  var screenshot = req.body.screenshot;
			//  var workTitle = req.body.workTitle;

				req.checkBody('workTitle', 'You must provide a title to your work').notEmpty();

				var err = req.validationErrors();

				var project = new Project({
							title : req.body.title,
							name: req.body.name,
							username : req.body.username
			});			
							console.log(new Work())
	
				var work = new Work(req.body); 

        work.save(function(err, work){
            if(err){
                res.send(err.message)
                console.log(err);
            }
            else{

								
								project.save(function(err, project){
            if(err){
                res.send(err.message)
                console.log(err);
            }
            else{

                console.log(work);	
								console.log(project);

            }
														res.redirect('/users/studentpage');

        });

            }

        });
    });










module.exports = router;
