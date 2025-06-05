const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); 

const usersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
    
}, {timestamps: true, versionKey: false})


usersSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  // method to generate JWT token

// compare hashed passwords
usersSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };  

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
