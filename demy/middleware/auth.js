const jwt=require('jsonwebtoken');
module.exports=function(req,res,next){
    const token=req.header('x-auth-token');
    if(!token){
        return res.status(401).json({msg:"why dont u givmee the token"})
    }
    try{
        const decoded=jwt.verify(token,"mysecrett");
        req.user=decoded.user;
        next();
    }
    catch(err){
        return res.status(401).json({msg:"invalid tokennn"});
    }
}