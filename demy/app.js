 // const express= require('express')
// const connectDB=require('./config/db')
// const app=express()
// connectDB();
// app.get('/',(req,res)=>res.send("api is running"));
// const port=process.env.port || 3001
// app.listen(port,()=>console.log(`server is running at${port}`))
// ---------------------
// const express=require('express');
// const { default: mongoose } = require('mongoose');
// const mongoose=require('mongoose');
// const app=express();
// mongoose.connect("",{
//     useNewUrlParser:true,useUnifiedTopology:true
// },(err)=>{
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log("conected monogodb via appjs");
//     }
// })
// app.listen(3001,()=>{
//     console.log("wer are connected via")
// })
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
var cors = require('cors');
app.use(cors());

// const database=moudule.exports=()=>{
    const database=()=>{
    const connectionParms={
        // useUnifiedToplogy:true,
        useNewUrlParser:true,
       
    }
    try{
mongoose.connect("mongodb+srv://radha:vijju9866R@cluster0.uluutyo.mongodb.net/radha?retryWrites=true&w=majority",connectionParms);
console.log("data base connected using new age coder video in appjs file.....");
    }
    catch(err){
        console.log(err.message);
        process.exit(0)
    }
}
database();
app.use(express.json({extended:false})); 
app.get('/', (req, res) => {
    res.send('radhas page')
  });
const userRoute=require('./routes/users')
app.use('/api/users',userRoute);
const authRoute=require('./routes/auth')
app.use('/api/auth',authRoute);
const findprofileRoute=require('./routes/profile');
app.use('/api/profile',findprofileRoute);
const profileRoute=require('./routes/profile');
app.use('/api/profile',profileRoute);

app.listen(3001,()=>{
        console.log("wer are connected via port 3001");
    });