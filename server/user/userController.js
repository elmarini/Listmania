const User = require('./userModel');
const path = require('path');

const userController = {};


userController.getAllUsers = (req, res) => {
   User.find({}, (err, users)=> {
      res.send(users);
  });
};


userController.createUser = (req, res, next) => {
let user = new User({username: req.body.username, password: req.body.password, profilepic: req.body.profilepic})
user.save(function (err) {
  if (err) {
     res.status(500).send(err);
  }
  else{
    res.currentUser = user;
    next();
  }
});
};




userController.verifyUser = (req, res, next) => {
  User.findOne({ username: req.body.username}, function(err, user) {
    if (err) {
      res.send(err)
    };
    if (user){
      user.comparePassword(req.body.password, function(err, isMatch) {
      if (err) {
          res.send(err);
          return;
       }
       else if (isMatch){
         res.currentUser = user;
         next();
         return
       }
       else if (!isMatch){
        res.redirect('/signup') 
       }
     })
    }
    else{
    res.redirect('/signup')
    }
});
}

module.exports = userController;
