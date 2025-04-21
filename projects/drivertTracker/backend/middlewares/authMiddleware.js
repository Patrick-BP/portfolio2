const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
   
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;
    
        
    // Verify the token
    const verified = jwt.verify(tokenString, process.env.JWT_SECRET);
    
    // Check if token is valid
    if (!verified) {
      return res.status(401).json({ msg: 'Authorization denied' });
    }
    // Check if user exists
    if (!verified._id) {
      return res.status(401).json({ msg: 'Authorization denied' });
    }
    // Check if user exists in database
    // Find user by id
    const user = await User.findById(verified._id);
    if (!user) { 
      return res.status(401).json({ msg: 'Authorization denied' });
    }
     // Add user info to request object
     req.user = { id: verified._id };

    next();
  } catch (err) {
    res.status(400).json({ msg: 'Unauthorized' , error: err.message});
  }
};