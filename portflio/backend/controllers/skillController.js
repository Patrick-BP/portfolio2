
const SkillModel = require("../models/skillModel") ;
const Response = require("../models/responseobj");

  exports.getAll = async (req, res) => {
    try {
      const skills = await SkillModel.find();
      res.status(200).json(new Response(false, " ", skills));;
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", null));
    }
  },

  exports.getById = async (req, res) => {
    try {
      const skill = await SkillModel.findById(req.params.id);
      if (!skill) return res.status(400).json(new Response(true, "Skill not found" , null));
      res.status(200).json(new Response(false, "Skill updated successfully", user));
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error" , null));
    }
  },

  exports.create = async (req, res) => {
   console.log(req.body)
     try {
          const findSkill = await SkillModel.findOne({name: req.body.name});
          
          if(findSkill){
          res.json(new Response(true, "Skill Already Exist", null))
      }else{
    const newSkill = {
      name: req.body.name,
      level: req.body.level,
      icon: req.body.icon
    };
    
    const result = await new SkillModel(newSkill).save();
    res.status(200).json(new Response(false, "Skill Created Successfully", result));
  }
  } catch (error) {
    res.status(400).json(new Response(true, "There was an Error. Try later!", null));
  }

  }

  exports.update = async (req, res) => {
    try {
      const skill = await SkillModel.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).json(new Response(false, "user was updated successfully", skill));

    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", error));
    }
  },

  exports.delete = async (req, res) => {
    try {
      await SkillModel.findByIdAndDelete(req.params.id);
      res.status(200).json(new Response(false, "User has been deleted", null));
       
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", error));
      
    }
  }

