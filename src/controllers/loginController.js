const author = require("../models/authorModel")
const jwt = require("jsonwebtoken")

/************************Satyam*************************************/
// const authorLogin = async(req, res) => {
//     try{
//         const email = req.body.email;
//         const password = req.body.password;
//         const authorData = await author.findOne({email:email,password:password});
//         if(authorData){
//           const token = await authorData.generateAuthToken();
//           res.status(200).send({token:token,autorId:authorData._id});
//         } else {
//           res.status(400).send({status:400,message:"Invalid Credentials"});
//         }
//     }catch(error) {
//         console.log(error);
//         res.status(400).send("invalid login Detailes")
//     }
//   }

/**********************Gautam*******************************************/
const authorLogin = async(req, res, next) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const checkAuthor = await author.findOne({email:email, password:password});
        if(!checkAuthor) return res.status(401).send({status: false, msg: "Either username or the password is incorrect"})

     // Generate tokens
     let token = jwt.sign(
       {
         authorId: checkAuthor._id.toString(),
        category: "Best"
       },
       "Best-Author"  //Secret key
       );

       res.status(201).send({status:true, msg: token})

       next();

    }
    catch(error){
      res.status(500).send({msg: "Error", error: error.message})
    }
  }

  module.exports = authorLogin