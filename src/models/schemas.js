const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const authorSchema = mongoose.Schema({ 
    fname: { type: String, required: true}, 
    lname: {type: String, required: true}, 
    title: {type: String, enum: ["Mr", "Mrs", "Miss"], required: true}, 
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email required"]
    }, 
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
    publishedAt: {type: Date}, 
    deletedAt: {type: Date}
}, { timestamps: true })

const author = mongoose.model('Author', authorSchema) //authors
const blog = mongoose.model('Blog', blogSchema) //blogs

module.exports = {author, blog}

