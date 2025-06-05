const ProfileModel = require("../models/profileModel");
const Response = require("../models/responseobj");
const fs = require('fs').promises; // Use promises for async/await
const path = require('path');

// Helper function to process the update
const processUpdate = async (req, res) => {
 
  try {
    const profile = await ProfileModel.findById(req.params.id);
    if (!profile) {
      return res.status(404).json(new Response(true, "Profile not found", null));
    }

    // Handle avatar and resume updates
    if (req.files.avatar) {
      if (profile.avatar) {
        const oldAvatarPath = path.join(__dirname, '..', profile.avatar);
        console.log(oldAvatarPath);
        await fs.unlink(oldAvatarPath).catch(err => console.error("Error deleting old avatar:", err));
      }
      profile.avatar = `/${req.files.avatar[0].path.split("\\").join("/")}`;
    }

    if (req.files.resume) {
      if (profile.resumeUrl) {
        const oldResumePath = path.join(__dirname, '..', profile.resumeUrl);
        await fs.unlink(oldResumePath).catch(err => console.error("Error deleting old resume:", err));
      }
      profile.resumeUrl = `/${req.files.resume[0].path.split("\\").join("/")}`;
    }

    // Update other fields
    Object.assign(profile, req.body);
    console.log(profile);

    await profile.save();
    res.status(200).json(new Response(false, "Profile updated", profile));
  } catch (error) {
    res.status(400).json(new Response(true, error.message, null));
  }
};



// Properly export all controller methods
module.exports = {
  getAll: async (req, res) => {
    
    try {
      const profiles = await ProfileModel.find();
      const mappedProfiles = profiles.map((profile) => {
        return {
          _id: profile._id,
          name: profile.name,
          title: profile.title,
          heading: profile.heading,
          email: profile.email,
          avatar: `http://localhost:3000${profile.avatar}`,
          resumeUrl: `http://localhost:3000${profile.resumeUrl}`,
          bio: profile.bio,
          location: profile.location,
          phone: profile.phone,
          twitter: profile.twitter,
          github: profile.github,
          linkedin: profile.linkedin,
          
        };
      })
      res.status(200).json(new Response(false, null, mappedProfiles));
    } catch (error) {
      res.status(400).json(new Response(true, error.message, null));
    }
  },
  
  getById: async (req, res) => {
    try {
      const profile = await ProfileModel.findById(req.params.id);
      if (!profile) {
        return res.status(404).json(new Response(true, "Profile not found", null));
      }
      res.status(200).json(new Response(false, null, profile));
    } catch (error) {
      res.status(500).json(new Response(true, error.message, null));
    }
  },
  
  create: async (req, res) => {
    try {
      const profile = await new ProfileModel(req.body).save();
      res.status(201).json(new Response(false, "Profile created", profile));
    } catch (error) {
      res.status(400).json(new Response(true, error.message, null));
    }
  },
  
  update: async (req, res) => {
    await processUpdate(req, res);
  },
  
  delete: async (req, res) => {
    try {
      const profile = await ProfileModel.findById(req.params.id);
      if (profile) {
        if (profile.avatar) {
          const avatarPath = path.join(__dirname, '../../public', profile.avatar);
          if (fs.existsSync(avatarPath)) {
            fs.unlinkSync(avatarPath);
          }
        }
        if (profile.resumeUrl) {
          const resumePath = path.join(__dirname, '../../public', profile.resumeUrl);
          if (fs.existsSync(resumePath)) {
            fs.unlinkSync(resumePath);
          }
        }
      }
      
      await ProfileModel.findByIdAndDelete(req.params.id);
      res.status(200).json(new Response(false, "Profile deleted", null));
    } catch (error) {
      res.status(400).json(new Response(true, error.message, null));
    }
  }
};