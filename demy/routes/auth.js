//----------------------------auth js ----------------
const expresss=require('express');
const auth=require('../middleware/auth');
const router=expresss.Router();
const User=require('../models/User');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const {check,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
//route get api/profile
//access is public
router.get('/',auth,async (req,res)=> {
    try{

        const user=await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("error form profile js fileee");
    }
    res.send('profile route');
});
router.post('/',[
    check('email',"needed validd emaill").isEmail(),
    check('password',"need passswordd").exists()
    
    ],
    async (req,res)=>{
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const {email,password}=req.body;
        try{
            console.log("place1");
            let user=await User.findOne({email});
            // user=false;
            console.log("place2");
        console.log(req.body);
        console.log("place3");
        if(!user){
            console.log("place4");
                res.status(400).json({errors:[{msg:"invalided creditentins"}]})
                console.log("place5");
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({errors:[{msg:"invalided creditentins"}]})
        }
        
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,"mysecrett",{expiresIn:3600},
        (err,token)=>{
            if(err) {throw err};
            res.json({token});
            // res.send(token);
            console.log(token);
        });
        // res.send("u are registereddd");
        }
        catch(err){
            console.log(err.message); 
            res.status(500).send("the server erorree");
        }
    })
module.exports=router;