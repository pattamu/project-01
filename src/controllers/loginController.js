const author = require("../models/authorModel")


const authorLogin = async(req, res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;
        const authorData = await author.findOne({email:email,password:password});
        if(authorData){
          const token = await authorData.generateAuthToken();
          res.status(200).send({token:token,autorId:authorData._id});
        } else {
          res.status(400).send({status:400,message:"Invalid Credentials"});
        }
    }catch(error) {
        console.log(error);
        res.status(400).send("invalid login Detailes")
    }
  }

  module.exports = {authorLogin}