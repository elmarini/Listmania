// const sessionController = require('./../session/sessionController');

const cookieController = {};


cookieController.setSSIDCookie = (req, res, next) => {
    console.log('document id ', res.currentUser.username);
  res.cookie("ssid", res.currentUser.username, {httpOnly: true, maxAge: 10000});
  next();
}

module.exports = cookieController;