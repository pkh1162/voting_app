'use strict';

var path = process.cwd();


//var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var UserPollHandler = require(path + "/app/controllers/userPollHandler.server.js");

module.exports = function (app, passport) {
    
    function isLoggedIn(req, res, next){
       // console.log(req.user);
        if (req.isAuthenticated()){
            return next();
        }
        else{
            res.redirect("/home");
        }
    }
    
    
    function hasVoted(req, res, next){
        next();
        
    }
    
    var userPollHandler = new UserPollHandler();
   // var clickHandler = new ClickHandler();

/*
    app.route("/home")
        .get(function(req, res){
            res.sendFile(path + "/public/home.html");
        })
  */
  
  app.route("/cookie/:pollId")
    .get(function(req, res){
        
        
        if (req.cookies.cookieName == undefined){
          //  console.log("in cookie function");
            var value = {
                votedOn : [req.params.pollId]
            }
            
            res.cookie("cookieName", value, {maxAge : 1000*100}).send("true");
        }
        else {
          // console.log("in else of cookiePolls");  
            var cookiePolls = req.cookies.cookieName.votedOn;
            
            
            if (cookiePolls.indexOf(req.params.pollId) === -1){
             
            
            cookiePolls.push(req.params.pollId);
            
             var val = {
                votedOn : cookiePolls
            }
           // console.log("before add array", req.cookies.cookieName.votedOn);
            
            res.cookie("cookieName", val, {maxAge : 1000*60*60*24*7});  //Cookie expires after one week
            //console.log("affter add array", req.cookies.cookieName.votedOn);
            
                res.send("true");
                
            }
            
            else {
                res.send("false");       
            }
         
           
           
            // res.cookie("cookieName", value, {maxAge : 1000*100}).send(req.cookies);
        }
        

    
    })
    
  
    app.route("/myProfile")
        .get(isLoggedIn, function(req, res){
            res.sendFile(path + "/public/myProfile.html");
        })
        
        
        app.route("/newPoll")
            .get(isLoggedIn, function(req, res){
                res.sendFile(path + "/public/newPoll.html");
            })
           
        
        
        
        
        
        

    app.route('/')
        .get(function (req, res) {
            res.sendFile(path + '/public/homePage.html');
        });
        
        
    app.route("/login")
        .get(function(req, res){
            res.sendFile(path + "/public/login.html");
        });
        
    app.route("/logout")
        .get(function(req, res){
            req.logout();
            res.redirect("/public/homePage.html");
        });
    
    
    app.route("/profile")
        .get(isLoggedIn, function(req, res) {
            res.sendFile(path + "/public/profile.html");
        });
        
        
    app.route("/api/:id")
        .get(isLoggedIn, function(req, res){
            res.json(req.user.github)
        });
        
        
    app.route('/auth/github')
    .get(passport.authenticate('github'));
        
    
   app.route('/auth/github/callback')
    .get(passport.authenticate('github', {
        successRedirect: '/myProfile',
        failureRedirect: '/home'
    }));



		
		
	
		
	app.route("/apiCall/polls")
	    .get(userPollHandler.getPolls)
	    .post(userPollHandler.addPoll, function(req, res, next){
	        res.redirect("/myProfile");
	    })
	    .delete(userPollHandler.deletePoll);
    //	.get(isLoggedIn, userPollHandler.getPolls)
    //	.post(isLoggedIn, userPollHandler.addPoll)
    //	.delete(isLoggedIn, userPollHandler.deletePoll);
    
    app.route("/getPolls")
        .get(userPollHandler.getallpolls);
		
	app.route("/deletePoll/:pollId")
	    .delete(userPollHandler.deletePoll)
		
	app.route("/getSingle/:pollId")
	    .get(userPollHandler.getSinglePoll);
	    
	app.route("/getSuggestions/:pollId")
	    .get(userPollHandler.getSuggestions);
	    
	    
	app.route("/voteInc/:optionId/:pollId")
	    .post(hasVoted, userPollHandler.addVote);
	    
	    
	app.route("/editPoll/:pollId")
	    .get(isLoggedIn, function(req, res){
	        res.sendFile(path + "/public/editPoll.html")
	    })
	    
	app.route("/home")
	    .get(function(req, res){
	        if (req.isAuthenticated()){
	            res.sendFile(path + "/public/homeLoggedIn.html"); 
	        }
	        else{
	            res.sendFile(path + "/public/homePage.html");    
	        }
	        
	    })
	    
	    
	app.route("/sendSuggestion/:idea/:pollId")
	    .post(userPollHandler.notify);
	        
	app.route("/getNotifications")
	    .get(userPollHandler.getNotifications);
	 
	app.route("/controlNote/:noteId")
	    .post(userPollHandler.implementNote)
	    .delete(userPollHandler.deleteNote)
	
	app.route("/addOption/:message/:pollId")
	    .post(userPollHandler.addOption)
	        
	    
    app.route("/signOut")
        .get(isLoggedIn, function(req, res){
             req.logout();
            
        })
};

/*
if (req.isAuthenticated()){
                res.sendFile(path + "/public/homeLoggedIn.html");
            }   
            */