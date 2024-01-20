const UserModel = require('../modals/userModel');
const expressAsyncHandler = require("express-async-handler");
const generateToken = require('../Config/generateToken');

const loginController = expressAsyncHandler( async (req , res) => {
    const {email , password} = req.body
    const user = await UserModel.findOne({email})

    if(user && (await user.matchPassword(password))){
        const response = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic : user.pic,
            token: generateToken(user._id),
        };
        res.json(response);
    }
    else{
        res.status(401);
        throw new Error("Invalid Email or Password");
    }
})


const registerController = expressAsyncHandler( async (req , res) => {

    // Checking for All fiels
    const {name , email , password , pic} = req.body
    if (!name) {
        return res.status(400).json({error:'Please enter your name'})
    }
    if (!email) {
        return res.status(400).json({error:'Please enter your email'}) 
    }
    if (!password) {
        return res.status(400).json({error:'Please enter your password'})   
    }

    // checking if a user is already exist
    const userExist = await UserModel.findOne({email})
    if (userExist) {
        throw new Error('User already Exists')
    }

    //USerName already Taken
    const usernameExist = await UserModel.findOne({name})
    if (usernameExist) {
        throw new Error('UserName already Taken')
    }

    //Create an entry for user in database
    const user = await UserModel.create({name , email , password , pic} ) ;
    if (user ) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          pic : user.pic,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
    }
    else{
        res.status(400);
        throw new Error("Registration Error");
    }
})

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await UserModel.find(keyword)
    .find({
      _id: { $ne: req.user._id }
    });
    res.send(users);
  });

module.exports = {
    loginController,
    registerController,
    fetchAllUsersController
  }