const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const authorSchema = mongoose.Schema({ 
    fname: { type: String, required: true}, 
    lname: {type: String, required: true}, 
    title: {type: String, enum: ["Mr", "Mrs", "Miss"], required: true}, 
    email: {type: String, required: true, unique: true}, 
    password: {type: String, required: true} 
}, { timestamps: true })

const blogSchema = mongoose.Schema({ 
    title: {type: String, required: true}, 
    body: {type: String, required: true}, 
    authorId: {type: ObjectId, ref: "Author"}, 
    tags: {type: [String]}, 
    category: {type: String, required: true},
    subcategory: {type: [String]}, 
    isDeleted: {type: Boolean, default: false}, 
    isPublished: {type: Boolean, default: false},
    publishedAt: {type: Date, default: Date.now()}, 
    deletedAt: {type: Date, default: Date.now()}
}, { timestamps: true })

const author = mongoose.model('Author', authorSchema) //authors
const blog = mongoose.model('Blog', blogSchema) //blogs

module.exports = {author, blog}

