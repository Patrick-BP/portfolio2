const Response = require("../models/responseobj");
const TimelineModel = require("../models/timelineModel");


  exports.getAll = async (req, res) => {
    try {
      const entries = await TimelineModel.find();
      res.status(200).json(new Response(false, " ", entries));
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", null));
    }
  },

  exports.getById = async (req, res) => {
    try {
      const entry = await TimelineModel.getById(parseInt(req.params.id));
      if (!entry) return res.status(404).json({ message: "Entry not found" });
      res.status(200).json(new Response(false, " " , entry));
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", null));
    }
  }

  exports.create = async (req, res) => {
    try {
      const entry = await TimelineModel.create(req.body);
      res.status(201).json(new Response(false, "New TimeLine was create", null));
    } catch (error) {
      res.status(400).json(new Response(true, "Invalid entry data", error ));
    }
  }

  
  exports.update = async (req, res) => {
    try {
     req.body.forEach(async timeline => {
      const findTimeLine = await TimelineModel.findById(timeline._id);
      if(findTimeLine){
          await TimelineModel.findByIdAndUpdate(timeline._id, timeline)
      }else{
       const newTimeLine = {
          dateRange: timeline.dateRange,
          title: timeline.title,
          company: timeline.company,
          description: timeline.description,
          skills: timeline.skills
        }
          await new TimelineModel(newTimeLine).save();
      }
      
     });
     res.status(200).json(new Response(false, "TimeLine saved Successfully", null))
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", null));
    }
  }

  exports.delete = async (req, res) => {
    try {
      await TimelineModel.findByIdAndDelete(req.params.id);
      res.status(200).json(new Response(false, "New TimeLine was Delete", null));
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", null));
    }
  };

