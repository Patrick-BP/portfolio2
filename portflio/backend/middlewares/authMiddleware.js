
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || authHeader !== "Bearer mysecrettoken") { 
    return res.status(403).json({ message: "Unauthorized access" });
  }
  
  next();
};

module.exports =  authenticate;