const mongoose = require('mongoose');
// var jwt = require("jsonwebtoken");

const authorSchema = mongoose.Schema({ 
    fname: {type: String, required: true}, 
    lname: {type: String, required: true}, 
    title: {type: String, enum: ["Mr", "Mrs", "Miss"], required: true}, 
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email required"]
    }, 
    password: {type: String, required: true} 
}, { timestamps: true })

// authorSchema.methods.generateAuthToken = async function() {
//     const User = this    
//     const token = jwt.sign({_id:User._id, authorName: `${User.fname}  ${User.lname}` },'author')
//     return token
// }




const authorModel = mongoose.model('Author', authorSchema) //authors

module.exports = authorModel

