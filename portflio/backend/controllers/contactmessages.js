
const MessagesModel = require("../models/contactmessagesModel") ;
const Response = require("../models/responseobj");

  exports.getAll = async (req, res) => {
    try {
      const messages = await MessagesModel.find();
      if (messages.length === 0) {
        return res.status(200).json(new Response(true, "No messages found", null));
      }
      res.status(200).json(new Response(false, " ", messages));;
    } catch (error) {
      res.status(400).json(new Response(true, "There was an Error", null));
    }
    }
    
exports.create = async (req, res) => {
    console.log(req.body);
    try {
        const result = await new MessagesModel(req.body).save();
        res.status(201).json(new Response(false, "A New Message was created", result));
    } catch (error) {
        console.error("Error creating message:", error); // Log the error
        res.status(400).json(new Response(true, "There was an Error creating the message. Try Later!", null));
    }
}

exports.delete = async (req, res) => {
    try {
        await MessagesModel.findByIdAndDelete(req.params.id);
        res.status(200).json(new Response(false, "Message has been deleted", null));
    } catch (error) {
        res.status(400).json(new Response(true, "There was an Error", null));
    }
};

exports.update = async (req, res) => {
    try {
        const updatedMessage = await MessagesModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(new Response(false, "Message has been updated", updatedMessage));
    } catch (error) {
        res.status(400).json(new Response(true, "There was an Error", null));
    }
};
