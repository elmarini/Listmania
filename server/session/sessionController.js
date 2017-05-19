const Session = require('./sessionModel');

const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
    if (res.currentUser.username === req.cookies.ssid) {
        Session.count({ username: req.cookies.ssid }), function (err, count) {
            if (count > 0) {
                next()
            }
            else {
                res.redirect('/signup')
            }
        }
    }
    else {
        res.redirect('/signup')
    }
};

sessionController.updateSession = (req, res, next) => {
    console.log("REQUEST BODY", req.body.username);
    Session.findOneAndUpdate({ cookieId: req.body.username }, { updatedAt: Date.now() }, (err, session) => {
        console.log(session);
        res.session = session;
        next();
        return;
    })
    next();
}


sessionController.getAllCookies = (req, res) => {
    Session.find({}, (err, cookies) => {
        res.send(cookies);
    });
};

sessionController.getLatest = (req, res) => {
    Session.findOne().sort({ updatedAt: -1 }).exec((err, session) => {
        res.send(session);
    });
}


sessionController.startSession = (req, res, next) => {

    if (res.currentUser) {
        if (Session.find({ cookieId: res.currentUser.username }, (err, session) => {
            console.log("FOUND SESSION: ", session)
            next();
            return;

        }));
        const newSession = new Session({ cookieId: res.currentUser.username, userPic: res.currentUser.profilepic })
        newSession.save(function (err) {
            if (err) {
                res.hasErr = err;
                next();
            }
        })
        next();
    }
}

module.exports = sessionController;
