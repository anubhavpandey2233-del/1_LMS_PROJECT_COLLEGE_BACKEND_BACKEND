const express = require('express');
const { userscontroller } = require('../../../controller');
const passport = require('passport');
const { tokenGenrater } = require('../../../controller/user.controller');
const creatPdf = require('../../../servicer/pdfMake');
const routers = express.Router()
const upload = require('../../../middleware/upload');



routers.post("/register", userscontroller.register)
routers.post("/login", userscontroller.login)
routers.post("/is_verify", userscontroller.is_verify)
routers.post("/gereratenewToken", userscontroller.gereratenewToken)
routers.post("/logout", userscontroller.logout)
routers.get("/checkAuth", userscontroller.checkAuth)
routers.post("/forgot", userscontroller.ForgotPass)
routers.post("/reset", userscontroller.ResetPass)
routers.put("/edit-profile/:id", upload.single('pfp'), userscontroller.editProfile);
routers.get("/counts", userscontroller.getUserCounts);

routers.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

routers.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function (req, res) {
    console.log("CallBack", req.user);

    const { accessToken, refreshToken } = await tokenGenrater(req.user._id);

    console.log(accessToken, refreshToken);

    const accOPNT = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 60 * 60 * 1000
    }

    const refOPNT = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 7 * 60 * 60 * 1000
    }

    return res
      .cookie("accessToken", accessToken, accOPNT)
      .cookie("refereshtoken", refreshToken, refOPNT)
      .status(200)
      .redirect("https://lms-harshdepani.vercel.app")
  });



routers.get('/auth/facebook',
  passport.authenticate('facebook'));

routers.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  async function (req, res) {

    const { accessToken, refreshToken } = await tokenGenrater(req.user._id);

    console.log(accessToken, refreshToken);

    const accOPNT = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 60 * 60 * 1000
    }

    const refOPNT = {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 7 * 60 * 60 * 1000
    }

    return res
      .cookie("accessToken", accessToken, accOPNT)
      .cookie("refereshtoken", refreshToken, refOPNT)
      .status(200)
      .redirect("https://lms-harshdepani.vercel.app")
  });


routers.get("/creatPdf", creatPdf);

module.exports = routers;