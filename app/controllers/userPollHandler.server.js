"use strict";

var Poll = require("../models/polls.js");
var Users = require("../models/users.js");


function UserPollHandler () {
	
	
	/*
	function optionsToArray (optionsParams) {
		var arr = [];
		
		for (var key in optionsParams){
			if(optionsParams.hasOwnProperty(key)){
				arr.push(optionsParams[key]);
			}
		}
	//	arr.shift();		//remove question, leave only options in the array.
		arr = arr.join(",").split(",");
		return arr;
	}
	*/
	
	
	function optionsToArray (optionsParams) {
		var arr = [];
		console.log("in new optionsParams")
		for (var i in optionsParams){
			arr.push(optionsParams[i]);
		}
		console.log(arr);

		return arr;
		
	}
	
	
	
	function initVotes (optionsLength){
		var voteArr = [];
		for (var i = 0; i<optionsLength; i++){
			voteArr.push(0);
		}
		return voteArr;
	}
    
    this.getPolls = function(req, res) {
        console.log("in get polls");
        Users.findOne({"github.id" : req.user.github.id}, {"_id" : false}).populate("userPolls.poll").exec(function(err, result){
            if (err){
                console.log("error with getting polls");
                throw err;
            }
            
            console.log("should get polls successfully");
            //res.json(result.nbrPolls);
         //   console.log(result);
             res.json(result);
             console.log("after json send");
        });
    }
    
    
    
    this.getSinglePoll = function(req, res){
    	Users
    		.findOne({"github.id" : req.user.github.id}, {"_id" : false}).populate("userPolls.poll").exec(function(err, result){
    			
    			if (err){
    				throw err
    			}
    				console.log("theoretically the pollId:" + req.params.pollId);
    				var recievedPollId = req.params.pollId.slice(-1);
   // 			console.log(result.userPolls.poll[req.param.pollId])
					//console.log("type before send to json: " + typeof result.userPolls.poll[recievedPollId].pollData);
	  			    console.log("after slice");
				//	res.json(result);
				    console.log(result.userPolls.poll[recievedPollId].pollData.pollOptions)
    				res.json(result.userPolls.poll[recievedPollId]);			
    		})
    }
    
    
    this.getNewPoll = function(req, res) {
      //  console.log("in addPoll");
      //  console.log(req.body);
      //  console.log(typeof req);
        res.json({});
        
    
    }
    
    
    this.addPoll = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, 
			{ $inc: { 'nbrPolls.polls': 1 }}
			)
			.exec(function (err, result) {
					if (err) { throw err; }
					
					console.log("after inc, before newPoll init");
					var newPoll = new Poll();
					newPoll.user.id = result.github.id;
					newPoll.pollData.pollId = result.nbrPolls.polls;
					newPoll.pollData.pollName = req.body.pollQuestion;
					
					console.log(req.body);
					console.log("before newPoll arrays");
					newPoll.pollData.pollOptions = optionsToArray(req.body.option);
					newPoll.pollData.pollVotes = initVotes(newPoll.pollData.pollOptions.length);
					console.log("after new pollarray");
					
					newPoll.save(function(err, pollResult){
					    if (err){
					        throw err;
					    }
					    
					    
					    
					    console.log("new poll saved");
					    
					    Users
					        .findOneAndUpdate({"github.id" : req.user.github.id}, {$push : {"userPolls.poll" : pollResult}})
					        .exec(function(err, user){
					            if (err){
					                throw err;
					            }
					            
					         console.log(user);
					         console.log("poll pushed");
					         
					         Users.findOne({"github.id" : req.user.github.id}, {"_id" : false}).populate("userPolls.poll").exec(function(err, query){
					             if (err){
					                 throw err;
					             }
					             
					             console.log("populated");
					             
					           
					             res.json(query);
					             console.log("pushed query");
					         })
					         
					         
					         
					            
					            
					        })
					
					    
					})
					
					
					
					
					
					
				
			
					
				}
			);
	};
	
	
	/*
	this.addVote = function(req, res){
		Users.findOne({"github.id" : req.user.github.id}).populate("userPolls.poll").exec(function(err, result){
			
			if (err){
				throw err;
			}
			console.log("params: " + req.params.optionId + ":  and the pollId: " + req.params.pollId);
			console.log(result.userPolls.poll);
			res.json(result);
			
		})
	}
	*/
	
	
	
	this.addVote = function(req, res){
		var updateVotes = {};
		var optionChosen = req.params.optionId;
	    var pathToOptionPicked = "pollData.pollVotes." + optionChosen;
		updateVotes[pathToOptionPicked] = 1;			//Query to increment vote option by 1
	
		Poll.findOneAndUpdate({_id : req.params.pollId}, { $inc : updateVotes})
		     .exec(function(err, pollData){
		     	if(err){
		     		throw err;
		     	}
		     	
		     	
		     	res.json(pollData);
		     	//console.log(pollInc.pllData);
		     /*	
		     	
		     	console.log(req.params.optionId);
		     	console.log(req.params.pollId);
		     	console.log(typeof req.params.optionId);
		     	console.log(result.pollData.pollVotes);
		     	console.log(result.pollData.pollVotes[req.params.optionId]);
     //         	result.pollData.pollVotes[req.params.optionId] = 3;
              	console.log(result.pollData.pollVotes[req.params.optionId]);
                result.pollData.pollVotes.update({ $inc : {"0" : 1}});
            //    result.save(function(err, pollInc){
            //    if (err){
            //    	throw err;
            //    }
                //Update the user with this poll as well.
               */
               
               
               /*
                Users.findOne({"github.id" : pollInc.user.id}).populate("userPolls.poll").exec(function(err, userDoc){
                	
                	if(err){
                		throw err;
                	}
                	
                	
					var chosenPollsId = pollInc.pollData.pollId;
					var pollVoteArray = pollInc.pollData.pollVotes.toObject();


                //	userDoc.userPolls.poll[pop].pollData.pollVotes = pollInc.pollData.poleVotes;
                  	userDoc.userPolls.poll[chosenPollsId].pollData.pollVotes = pollVoteArray;

                	console.log("The new user poll votes: " + userDoc.userPolls.poll[chosenPollsId].pollData.pollVotes);
                	userDoc.save(function(err, finalResult){
                		if (err){
                			throw err;
                		}
                		console.log(finalResult);
                		res.json(finalResult);
                	})
                
                })
                
               */
                	
             //   })
		     
		     	
		     })
	}
	
	


    
    
    this.deletePoll = function(req, res){
        Poll
        	.findOne({"pollData.pollId" : 0}).remove().exec(function(err, result){
        		
        		console.log(result);
        		if (err){
        			throw err;
        		}
        		
        		res.json(result);
        	})
        
    }
}


module.exports = UserPollHandler;