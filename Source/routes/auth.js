// Requiring our models and passport as we've configured it
const db = require("../models");
const express = require("express")
const passport = require("../config/passport");
const Security = require('../helpers/Security');
let security = new Security();
const authRouter = express.Router();

  authRouter.post("/login", passport.authenticate("local"), function(req, res, err) {
      console.log(req.user)
      let user = req.user;
      const { email, id } =  user.dataValues
      const token = security.getNewUserToken(email,id);
      res.send({ user: { email, id, token }, token: token });
    });

  authRouter.post("/signup", function(req, res, err) {
   
    db.User.create({
      email: req.body.username,
      password: req.body.password
    }).then(function(user) { 
      const { email, id } =  user.dataValues
      const token = security.getNewUserToken(email,id);
  
      return res.status(201).send({ user: { email, id, token }, token: token });
    }).catch(function(err) {
      console.log(err)
      return res.status(500).send({success: false, err});
    });
  });


module.exports = authRouter;
