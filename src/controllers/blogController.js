const author = require("../models/authorModel")
const blog = require("../models/blogModel")
const mongoose = require("mongoose")

const createBlogs = async (req,res) => {
        try{ 
            /**************************************Authorization Check*******************************************/
            // let authorId = req.body.authorId
            // let authorLoggedIn = req.headers['Author-login']
            // if(authorId != authorLoggedIn) return res.status(401).send({status:false, msg: "Please use your own author id"})
            /********************************************VALIDATION************************************************/           
            let data = req.body
            if(!Object.keys(data).length) 
                return res.status(400).send({status: false, msg: "You must enter data to create a Blog."})
            if(!mongoose.isValidObjectId(data.authorId))
                return res.status(400).send({status: false, msg: "Invalid Author ObjectId."})
            /*******************************************************************************************************/
            data.tags = [...new Set(data.tags)]
            data.subcategory = [...new Set(data.subcategory)]
            if(data.isPublished)
                data.publishedAt = Date.now()
            if(!await author.findById(req.body.authorId)) 
                return res.status(400).send({status: false, msg: "Author Id doesn't present in our DataBase."})
            if(await blog.exists(data)) 
                return res.status(400).send({status: false, msg: "Blog already present"})
            let created = await blog.create(data)
            res.status(201).send({status: true, data: created})
        }
        catch(err){
            console.log(err.message)
            res.status(500).send({status: false, msg: err.message})
        }
    }


const getBlogs = async (req,res) => {
    try{
        delete req.query.title
        delete req.query.body
        
        let filter = await blog.find({$and: [req.query, {isDeleted: false}, {isPublished: true}]})
        if(!filter.length)
            return res.status(404).send({status: false, msg: "No such documents found"})
        res.status(200).send({status: true, data: filter})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}


const updateBlogs = async (req,res) => {
    try{
        /*************************************VALIDATION****************************************/
        if(!Object.keys(req.body).length) 
            return res.status(400).send({status: false, msg: "No data provided to update."})
        if(!mongoose.isValidObjectId(req.params.blogId))
            return res.status(400).send({status: false, msg: "Invalid Blog objectId."})

        let findBlog = await blog.findOne({_id:req.params.blogId, isDeleted: false})
        if(!findBlog)
            return res.status(404).send({status: false, msg: "No such documents found"})
        /******************************Authorization Check*****************************/
        if(req.headers['Author-login'] != findBlog.authorId)
            return res.status(401).send({status: false, msg: "You can't update this Blog."})
        /*********************************************************************************/
        let {title, body, tags, subcategory} = req.body
        let updatedblog = await blog.findOneAndUpdate({_id: req.params.blogId, isDeleted: false},
                                                    {$addToSet: {tags: {$each:tags||[]},subcategory:{$each:subcategory||[]}},
                                                    title: title, body: body,
                                                    publishedAt: Date.now(),
                                                    isPublished: true},
                                                    {new: true})
        res.status(200).send({status: true, data: updatedblog})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}


const deleteBlogs = async (req, res) => {
    try{
        /*******************************VALIDATION***********************************/
        if(!mongoose.isValidObjectId(req.params.blogId)) 
            return res.status(404).send({status:false, msg:'Invalid Blog objectId.'}) 
        /******************************Authorization Check*****************************/
        let authCheck = await blog.findById(req.params.blogId)
        if(authCheck.authorId != req.headers['Author-login'])
            return res.status(401).send({status: false, msg: "You don't have authority to delete this Blog."})
        /*********************************************************************************/
        let deletedBlog = await blog.findOneAndUpdate({_id:req.params.blogId,isDeleted:false},{isDeleted:true})
        if(!deletedBlog)
            return res.status(404).send({status:false, msg:"No Document found."})
        res.status(200).end();
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status:false, msg: (err.message)})
    }
}


const deleteBlogsQP = async (req,res) => {
    try{
        /***********************************VALIDATION****************************************/
        if(!Object.keys(req.query).length) 
            return res.status(406).send({status: false, msg: "Please select some filters for deletion."})
        /**********************************Authorization Check********************************/
        delete req.query.authorId
        let id = req.headers['Author-login']
        let findBlogs = (await blog.find({$and: [req.query,{authorId: id},{isDeleted: false},{isPublished: false}]}))
        if(!findBlogs.length) 
            return res.status(404).send({status: false, msg: "No documents found."})
        /***************************************************************************************/
        let blogs = await blog.updateMany({_id: findBlogs},{isDeleted:true})
        if(blogs.matchedCount == 0) 
            return res.status(404).send({status:false, data: "No documents found."})
        res.status(200).send({status: true, data: `Total deleted document count: ${blogs.modifiedCount}`});
    }
    catch(err){
        console.log(err)
        res.status(500).send({status:false, msg: err.message})
    }
}

module.exports = {getBlogs,createBlogs,updateBlogs,deleteBlogs,deleteBlogsQP}


