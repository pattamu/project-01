const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({ 
    fname: {type: String, required: true, trim: true}, 
    lname: {type: String, required: true, trim: true}, 
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

const authorModel = mongoose.model('Author', authorSchema) //authors

module.exports = authorModel

