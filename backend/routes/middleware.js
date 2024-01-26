const { JWTSECRET } = require('./config');






const jwt = require('jsonwebtoken');
const authMiddleware=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({});
    }
    const token=authHeader.split(' ')[1];
    try{
        const decoded=jwt.verify(token,JWTSECRET);
        req.userId=decoded.userId;
        next();

    }
   catch(e){
    return res.status(403).json();
   }
    
    
}
module.exports=authMiddleware;
