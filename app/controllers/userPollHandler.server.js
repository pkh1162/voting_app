"use strict";

var Poll = require("../models/polls.js");
var Users = require("../models/users.js");


function UserPollHandler () {
	
	

    this.getPolls = function(req, res) {
      
        Users.findOne({"github.id" : req.user.github.id}, {"_id" : false}).populate("userPolls.poll").exec(function(err, result){
            
            if (err){
                console.log("error with getting polls");
                throw err;
            }
            
             res.json(result.userPolls.poll);
        });
    }
    
    
  
    
    this.getSinglePoll = function(req, res){
    	
    	Poll	
    		.findOne({"_id" : req.params.pollId}).exec(function(err, pollFound){
    			if(err){
    				throw err;
    			}
    			res.json(pollFound);
    		})
    }
    
    
    
    
    
    this.getNewPoll = function(req, res) {
      //  console.log("in addPoll");
      //  console.log(req.body);
      //  console.log(typeof req);
        res.json({});
        
    
    }
    
    
    
    this.addPoll = function(req, res, next){
    	
    	Users.findOne({"github.id" : req.user.github.id}).exec(function(err, user){
    		console.log(req.body);
    		
    		var newPoll = new Poll();
    		
    		newPoll.pollData.pollName = req.body.pollQuestion;
    		newPoll.pollData.pollId = newPoll._id;
    		
    		var setOptions = function(options){
    			
    			var arr = [];
    			
    			for (var key in options){
    				var voteObj = {};
    				voteObj = {
    					opt : options[key],
    					nbrVotes : 0
    				};
    				arr.push(voteObj);
    			}
    			
    			return arr;
    		}
    		
    		newPoll.user.id = req.user.github.id
    		newPoll.pollData.votes = setOptions(req.body.option)
    		newPoll.save(function(err, savedPoll){
    			console.log(newPoll);
    		    console.log(newPoll.pollData.votes);
    		    //newPoll.pollData.votes = 
                //res.json(savedPoll);	
    		
    		    
    		    Users    
    		       .findOneAndUpdate({"github.id" : req.user.github.id}, {$push : {"userPolls.poll" : savedPoll}, $inc:{"nbrPolls.polls" : 1}})
    		          .populate("userPolls.poll").exec(function(err, result){
    		          	if (err){
    		          		throw err;
    		          	}
    		          	
    		          	
    		          	next();
    		          //	res.json(result);
    		          })
    		
    		
    		
    			
    		})
    		
    		
    	})
    	
    	
    }
    
    
    this.addingOne = function(req, res){
    	Poll
				.findOneAndUpdate({_id : req.params.pollId}, {$inc : {"pollData.votes.0.nbrVotes" : 1}}).exec(function(err, incrementedData){
						
						if(err){
							throw err;
						}
						console.log("nbr votes:   " + incrementedData.pollData.votes[0].nbrVotes);
						console.log(incrementedData);
						res.json(incrementedData);
						
					})	
    }
	
	this.addVote = function(req, res){
		
	
	
		
	
	
	
	
		console.log("Params sent with addVote are:  " + req.params.optionId + "::     and pollId:   " + req.params.pollId);
		
		
		var optionChosen = req.params.optionId
		var pollId = req.params.pollId;
	    
	
		Poll.findOne({_id : pollId})
		     .exec(function(err, pollFound){
		     	if(err){
		     		throw err;
		     	}
		     	
		     	var indexOfPick = 999;
				for (var i in pollFound.pollData.votes){
					if(pollFound.pollData.votes[i]._id == optionChosen){
						console.log("you picked this: " + optionChosen);
						indexOfPick = i;
					}
				}
				
				//console.log("lfjkfdlkjfd");
				console.log("your pick is at index: " + indexOfPick);
				
				
				var updateQuery = {};
	    		var pathToOptionPicked = "pollData.votes." + indexOfPick.toString() + ".nbrVotes";
				updateQuery[pathToOptionPicked] = 1;			//Query to increment vote option by 1
				
						
				
				Poll
					.findOneAndUpdate({_id : pollId}, {$inc : updateQuery}).exec(function(err, incrementedData){
						
						if(err){
							throw err;
						}
						console.log("nbr votes:   " + incrementedData.pollData.votes[0].nbrVotes);
						console.log(incrementedData);
						res.json(incrementedData);
						
					})
				
				
				
		    // 	console.log(pollData.pollData.votes.find(x=> x._id == "57d6c174002dfd0861904c63").nbrVotes);
		     	
		     
		   
		     
		     })
	

	
	}
	
	
    this.getallpolls = function(req, res) {
    	
    	Poll
    	    .find({}).exec(function(err, polls){
    	    	
    	    	if(err)
    	    	{
    	    		throw err;
    	    	}
    	    	
    	    	res.json(polls);
    	    	
    	    })
    }

    this.deletePoll = function(req, res){
    	
    	console.log("this is the delted poll id", req.params.pollId);
        Poll
        	.findOne({"_id" : req.params.pollId}).remove().exec(function(err, result){
        		
        		if (err){
        			throw err;
        		}
        		
        		
        		Users.update({"github.id" : req.user.github.id},
        		{$inc : {"nbrPolls.polls": -1}}).exec(function(err, user){
        			if(err){
        				throw err;
        			}
        			
        			console.log("hello");
        			res.json(result);
        			
        		})
        		
        	})
        
    }
    
    
    
    this.notify = function(req, res){
    
    	console.log("The notification is:" + req.params.idea + req.params.pollId);
    	//find poll. Get user id.
    	//use user id to get user.
    	//update users notifications with req params.
    	
    	Poll.findOne({"_id" : req.params.pollId}).exec(function(err, poll){
    		if(err){
    			throw err;
    		}
    		
    		var notification = {
    			"message"  : req.params.idea,
    			"pollId"   : req.params.pollId
    		}
    		
    		var userGitId = poll.user.id;
    		
    		Users.findOneAndUpdate({"github.id" : userGitId}, {$push : {"notifications" : notification}})
    			.exec(function(err, updatedNotifications){
    				if(err){
    					throw err;
    				}
    				console.log(updatedNotifications);
    				
    				res.json({});		
    			})
    		
			
    		
    	})
    	
    	
    }
	
	
	this.getNotifications = function(req, res){
		Users.findOne({"github.id" : req.user.github.id}).exec(function(err, result){
			if(err){
				throw err;
			}
			
			res.json(result.notifications);
			
		})
	}   
}


module.exports = UserPollHandler;