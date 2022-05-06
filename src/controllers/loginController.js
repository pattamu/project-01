const author = require("../models/authorModel")
const jwt = require("jsonwebtoken")

const generateAuthToken = function(authorData) {
  const User = authorData    
  const token = jwt.sign(
                        {
                            authorId: User._id.toString(),
                            email: User.email
                        },
                        "Best-Author"  //Secret key
                        );
  return token
}

const authorLogin = async(req, res) => {
    try{
        if(Object.keys(req.body).length <= 1) 
            return res.status(400).send({status: false, msg: "Must enter email and password."})
        const email = req.body.email;
        const password = req.body.password;
        const authorData = await author.findOne({email:email,password:password});
        if(!authorData) 
            return res.status(401).send({status: false, msg: "Either username or the password is incorrect"})
        
        const token = generateAuthToken(authorData);
        res.setHeader('x-api-key', token)
        // res.header('x-api-key', token)//This can be written as well to set header in response header inplace of line 25
        res.status(201).send({status:true,msg: "token generated successfully.", data:{token:token}});

    }catch(error) {
        console.log(error);
        res.status(400).send("invalid login Detailes")
    }
}

module.exports = authorLogin