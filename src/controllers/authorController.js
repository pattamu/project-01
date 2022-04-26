const {author, blog} = require("../models/schemas")

const createAuthor = async (req,res) => {
    try{
        let data = req.body
        let created = await author.create(data)
        res.status(201).send({status: true, data: created})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}


module.exports = {createAuthor}

// createBlogs, getBlogs, updateBlogs, deleteBlogs, deleteBlogsQP