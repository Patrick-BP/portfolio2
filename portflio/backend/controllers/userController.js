
const UserModel = require("../models/userModel") ;
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const Response = require("../models/responseobj");

  exports.getAll = async (req, res) => {
    try {
      const users = await UserModel.find();
      const userMap = users.map(user =>{
        return{
                userid: user._id, 
                name: user.name, 
                username:user.username, 
                email:user.email
              }
      } )
      res.status(200).json(new Response(false, " ", userMap));;
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", null));
    }
  },

  exports.getById = async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(400).json(new Response(true, "User not found" , null));
      res.status(200).json(new Response(false, "Project updated successfully", user));
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error" , null));
    }
  },

  exports.create = async (req, res) => {
   
     try {
          const findUser = await UserModel.findOne({email: req.body.email});
          
          if(findUser){
          res.json(new Response(true, "user Already Exist", null))
      }else{
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = {
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      role:req.body.role
    };
    
    const result = await new UserModel(newUser).save();
    res.json(new Response(false, "User Created Successfully", result));
  }
  } catch (error) {
    res.status(400).json(new Response(true, "There was an Error. Try later!", null));
  }

  }

  exports.update = async (req, res) => {
    try {
      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json(new Response(false, "user was updated successfully", null));

    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", error));
    }
  },

  exports.delete = async (req, res) => {
    try {
      await UserModel.findByIdAndDelete(req.params.id);
      res.status(200).json(new Response(false, "User has been deleted", null));
       
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", error));
      
    }
  }

