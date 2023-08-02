const express=require('express');
const auth=require('../middleware/auth')
const User=require('../models/User');
const request=require('request');
const Profile=require('../models/profile');
const router=express.Router();
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const {check,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
//for getting full details which is protetected
router.get('/',auth,async (req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile){
            return res.status(400).json({msg:"no userrr profilee found (i am rom profile js route"});
        }
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("server error");
    }
    
});
router.post('/',[
    auth,[
        
        check('skills','skillls is neeeded').not().isEmpty()
    ]
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {
        company,
        website,
        location,
        bio,
        staus,gihubusername,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        status,
        facebook,
      } = req.body;
const profileFields={};
 profileFields.user=req.user.id;
 if(company) profileFields.company=company;
 if(website) profileFields.website=website;
 if(bio) profileFields.bio=bio;
 if(status) profileFields.status=staus;
if(location) profileFields.status=location;
 if(gihubusername) profileFields.gihubusername=githubusername;
 if(skills){
    profileFields.skills=skills.split(',').map(skill=>skill.trim())
 }
 if(twitter) profileFields.twitter=twitter;
 if(facebook) profileFields.facebook=facebook;
 if(instagram) profileFields.instagram=instagram;
try{
    let profile= await Profile.findOne({user:req.user.id});
    if(profile){
        //update
        console.log('place1');
        profile=await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});
        console.log('place2');
        // return res.status(400).json({msg:"no profile with ths user idd"});
        // return res.json(profile);
        return res.json(profile)
        console.log('place3');
    }
    console.log('place4');
    profile=new Profile(profileFields);
    console.log('place5');
    await profile.save();
    console.log('place6');
    return res.json(profile);
    console.log("uupdated succefully (your profile)");

}catch(err){
    console.error(err.message);
    res.status(500).send("serverrrr errr"); 
}

console.log(skills);
res.send("form js profile route post requrest ithink sended ur profiles");
});
router.get('/all',async(req,res)=>{
    try{
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    }catch(err){
        console.error(err.message);
        res.status(500).send("errorr from profile js all route")
    }
})
router.get('/user/:user_id',async(req,res)=>{
    try{
        console.log("inplace1");
        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        console.log("inplace2");
        if(!profile){
            console.log("inplace222");
           return res.json(4000).json({msg:"no prfile with this user id"});
        }console.log("inplace3");
        console.log(profile);
        console.log("inplace4");
     res.json(profile);
    }catch(err){
        console.log("inplace5");
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:"no profile with ths user idd"});
        }
        console.error(err.message);
        console.log("inplace6");
        res.status(500).send("errorr from profile js all route");
    }
});
router.delete('/',auth,async (req,res)=>{
    try{
    await Profile.findOneAndRemove({user:req.user.id});
    await User.findOneAndRemove({_id:req.user.id});
res.json({msg:"uu deleted successfully"});    
}catch(err){
    console.error(err.message);
    res.status(500).send('serrrverr errror');
}
});
router.put(
    '/experience',
    auth,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past')
      .notEmpty()
      .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.experience.unshift(req.body);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

  router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      foundProfile.experience = foundProfile.experience.filter(
        (exp) => exp._id.toString() !== req.params.exp_id
      );
  
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
  router.get('/github/:username', async (req, res) => {
    try {
      const uri = encodeURI(
        `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
      );
      const headers = {
        'user-agent': 'node.js',
      };
  
      const gitHubResponse = await axios.get(uri, { headers });
      return res.json(gitHubResponse.data);
    } catch (err) {
      console.error(err.message);
      return res.status(404).json({ msg: 'No Github profile found' });
    }
  });


module.exports=router;