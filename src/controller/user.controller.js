const Users = require("../model/user.model");
const bcrypt = require("bcrypt");
const sendMail = require("../servicer/nodemailer");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sendSMS = require("../servicer/twilio");
const { uploadcloudinary } = require("../servicer/cloudinary");

const tokenGenrater = async (_id) => {
  // #swagger.tags = ['user']
  try {
    console.log(_id);

    const user = await Users.findById(_id);

    const accessToken = jwt.sign(
      { _id: _id, expiresIn: "1h", role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      },
    );

    const refreshToken = jwt.sign(
      {
        _id: _id,
        expiresIn: "30d",
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "30d",
      },
    );

    user.refreshToken = refreshToken;

    await user.save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};

const register = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { email, password, phone_no } = req.body;

    const hashPass = await bcrypt.hash(password, 10);

    const OTP = Math.floor(100000 + Math.random() * 900000);

    const userExites = await Users.findOne({ email });

    const user = await Users.create({
      ...req.body,
      password: hashPass,
      OTP: OTP,
    });

    if (userExites) {
      return res
        .status(400)
        .json({ sucess: false, data: null, Message: "User Already Exites" });
    }

    sendMail(email, "Register OTP ", "Your OTP is : " + OTP);
    // sendSMS(phone_no, OTP)

    const userdata = await Users.findOne({ email }).select("-password -OTP");

    if (!user) {
      return res
        .status(400)
        .json({
          sucess: false,
          data: [],
          Message: "Users register not complete",
        });
    }

    return res
      .status(200)
      .json({
        sucess: true,
        data: userdata,
        Message: "Users register sucessfully.",
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        data: null,
        Message: "Internal Server Error :" + error,
      });
  }
};

const is_verify = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { email, OTP } = req.body;

    const userverify = await Users.findOne({ email: email, OTP: OTP });

    if (!userverify) {
      return res
        .status(400)
        .json({
          sucess: false,
          data: null,
          Message: "Invaild Username/Email or OTP",
        });
    }

    userverify.is_verify = true;

    userverify.save();

    return res
      .status(200)
      .json({
        sucess: true,
        data: userverify,
        Message: "Users Verfivcation Complete.",
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        data: null,
        Message: "Internal Server Error :" + error,
      });
  }
};

const login = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { email, password } = req.body;

    const userExites = await Users.findOne({ email });

    if (!userExites) {
      return res
        .status(400)
        .json({ sucess: false, data: null, Message: "User not Exites" });
    }

    const passisMatched = await bcrypt.compare(password, userExites.password);
    console.log(passisMatched);

    if (!passisMatched) {
      return res
        .status(400)
        .json({
          sucess: false,
          data: null,
          Message: "Invaild Password or Username/Email",
        });
    }

    if (!userExites.is_verify) {
      return res
        .status(400)
        .json({ sucess: false, data: null, Message: "Verify Email." });
    }

    const { accessToken, refreshToken } = await tokenGenrater(userExites._id);

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
      .cookie("refreshToken", refreshToken, refOPNT)
      .status(200)
      .json({
        sucess: true,
        data: userExites,
        Message: "Login Sucessfully.",
      });


  } catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        data: null,
        Message: "Internal Server Error :" + error,
      });
  }
};

const gereratenewToken = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    console.log(req.cookies.refreshToken);

    const decoded = await jwt.verify(
      req.cookies.refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    console.log(decoded);


    if (!decoded) {
      return res
        .status(400)
        .json({ sucess: false, data: null, Message: "Invalid Refresh Token" });
    }

    const user = await Users.findById(decoded._id);

    console.log(user);

    if (user.refreshToken !== req.cookies.refreshToken) {
      return res
        .status(404)
        .json({ sucess: false, data: null, Message: "User Not Found." });
    }

    const { accessToken, refreshToken } = await tokenGenrater(user._id);

    console.log("acc, re", accessToken, refreshToken);

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
      .cookie("refreshToken", refreshToken, refOPNT)
      .status(200)
      .json({
        sucess: true,
        data: user,
        Message: "New Access Token Generated Successfully.",
      });
  }
  catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        data: null,
        Message: "Internal Server Error :" + error,
      });
  }
};

const logout = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { _id } = req.body;

    console.log("idddddd:", _id);

    const user = await Users.findByIdAndUpdate(
      { _id },
      {
        $unset: {
          refreshToken: 1
        }
      },
      { new: true }
    );

    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, data: null, Message: "User Not logouted." });
    }

    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({
        sucess: true,
        data: null,
        Message: "Logout Sucessfully.",
      });

  } catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        data: null,
        Message: "Internal Server Error :" + error,
      });
  }
}

const checkAuth = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");


    if (!token) {
      return res.status(401).json({
        sucess: false,
        data: [],
        Message: "User Logout",
      });
    }

    const decode = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );

    if (!decode) {
      return res.status(400).json({
        sucess: false,
        data: [],
        Message: "Invaild Token",
      });
    }

    const user = await Users.findById(decode._id);

    if (!user) {
      return res.status(404).json({
        sucess: false,
        data: [],
        Message: "user not found",
      });
    }

    return res.status(200).json({
      sucess: true,
      data: user,
      Message: "user authentication complet",
    });

  } catch (error) {
    return res
      .status(500)
      .json({
        sucess: false,
        data: null,
        Message: "Internal Server Error :" + error,
      });
  }
}

const ForgotPass = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { email } = req.body;

    const userExites = await Users.findOne({ email });

    if (!userExites) {
      return res
        .status(400)
        .json({ sucess: false, data: null, Message: "User not Exites" });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);

    sendMail(email, "Register OTP ", "Your OTP is : " + OTP);

    userExites.OTP = OTP;

    await userExites.save();

    return res
      .status(200)
      .json({ sucess: true, data: userExites, Message: "OTP send Sucessfully" });

  } catch (error) {
    console.log(error);

  }
}

const ResetPass = async (req, res) => {
  // #swagger.tags = ['user']
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ sucess: false, data: null, Message: "User not Exites" });
    }

    const hashPass = await bcrypt.hash(password, 10);

    user.password = hashPass;

    await user.save();

    return res
      .status(200)
      .json({ sucess: true, data: user, Message: "Password Change Sucessfully" });
  } catch (error) {
    console.log(error);

  }
}

const editProfile = async (req, res) => {
  try {
    const userExites = await Users.findById(req.params.id);

    if (!userExites) {
      return res.status(404).json({
        sucess: false,
        data: null,
        Message: "User Not Found",
      });
    }
    console.log("filesssss", req.file);
    
    const cloudinaryObj = await uploadcloudinary(req?.file?.path, 'PFP')
    console.log("objjjjj", cloudinaryObj);

    const data = {...req.body, pfp: {
            public_id: cloudinaryObj.public_id,
            url: cloudinaryObj.url
        }}

    const user = await Users.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    )

    return res.status(200).json({
      sucess: true,
      data: user,
      Message: "Profile Updated Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      sucess: false,
      data: null,
      Message: "Internal Server Error : " + error.message,
    });
  }
};

const getUserCounts = async (req, res) => {
  try {
    const [teachers, students] = await Promise.all([
      Users.countDocuments({ role: "Instructor", is_active: true }),
      Users.countDocuments({ role: "user", is_active: true })
    ]);

    return res.status(200).json({
      success: true,
      data: { teachers, students }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  is_verify,
  login,
  gereratenewToken,
  logout,
  checkAuth,
  tokenGenrater,
  ForgotPass,
  ResetPass,
  editProfile,
  getUserCounts
};