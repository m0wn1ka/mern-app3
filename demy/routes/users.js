//------------------regiserainon-------------
// import { check } from 'express-validator';
// const expresss=require('express');
// const router=expresss.Router();
// const{check,validationResult}=require('express-validator/check');
// const User=require('../models/User');
// const gravatar=require('gravatar');
// const bcrypt=require('bcryptjs');
// //route get api/users
// //access is public
// router.post('/',
// [
// check('name',"name cant be empty").not().isEmpty,
// check('email','need valid emailll').isEmail,
// check('password','need pswd with lengthhh lest of 6').isLength({min:6})

// ],

// async (req,res)=>{
//     const errors=validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()})
//     }
//     const {name,email,password}=req.body;
//     try{
//         let user=await User.findOne({email});
//         if(user){
//             res.status(400).json({errors:[{msg:"ussser already exists"}]});
//         }
//         const avatar=gravatar.url(email,{
//             s:'200',
//             r:'pg',
//             d:'mm'
//         }
//         )
//         user=new User({
//             name,email,avatar,password
//         });
//         const salt=await bcrypt.genSalt(10);
//         user.password=await bcrypt.hash(password,salt);
//         await   user.save();
//         res.send('user has beeen registerd');
//     }
//     catch(err){
//         console.error(err.message);
//         res.status(500).send('the server errrror occcured');

//     }
    
    
// });
// module.exports=router;


const expresss=require('express');
const router=expresss.Router();
const User=require('../models/User');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const {check,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');

router.post('/',[
check('name',"names is neededdd").not().isEmpty(),
check('email',"needed validd emaill").isEmail(),
check('password',"need atleast 6 leng").isLength({min:6})

],
async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {name,email,password}=req.body;
    try{
        console.log("place1");
        let user=await User.findOne({email});
        // user=false;
        console.log("place2");
    console.log(req.body);
    console.log("place3");
    if(user){
        console.log("place4");
            res.status(400).json({errors:[{msg:"user already exit"}]})
            console.log("place5");
    }
    console.log("in place6");
    const avatar=gravatar.url(email,{s:'200',r:"pg",d:'mm'})
    console.log("in place7");
    user=new User({
        name,email,avatar,password
    }) ;
    console.log("in place8");
    const salt= await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(password,salt);
    console.log("in place9");
    await user.save();
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