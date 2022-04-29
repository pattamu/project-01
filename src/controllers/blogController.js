const author = require("../models/authorModel")
const blog = require("../models/blogModel")

const createBlogs = async (req,res) => {
        try{ 
            /**************************************Authentication Check*******************************************/
            let authorId = req.body.authorId
            let authorLoggedIn = req.headers['Author-login']
            if(authorId != authorLoggedIn) return res.status(403).send({status:false, msg: "Please use your own author id"})
            /********************************************VALIDATION************************************************/
            let data = req.body
            if(!Object.keys(data).length) return res.status(400).send({status: false, msg: "You must enter data."})

            if(!data.authorId.match(checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
            return res.send({status: false, msg: "Please enter a valid Author ObjectId."})
            /*******************************************************************************************************/
            if(!await author.findById(req.body.authorId)) 
            return res.status(208).send({status: false, msg: "Incorrect Author Id"})
            if(await blog.exists(data)) 
            return res.status(208).send({status: false, msg: "Blog already present"})
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
        if(req.query.title && !req.query.body) delete req.query.title
        else if(req.query.body && !req.query.title) delete req.query.body
        else if(req.query.title && req.query.body){
            delete req.query.title
            delete req.query.body
        }
        if(!Object.keys(req.query).length) 
        return res.status(403).send({status: false, msg: "No filters applied or apply filters apart from 'title' and 'body'."})
        req.query.isDeleted = false
        req.query.isPublished = true
        let filter = (await blog.find(req.query)).filter(x => x.authorId == req.headers['Author-login'])//<---AUTHENTICATION Check--->
        //line 43 - filter is used to get all blog datas of the logged in user only
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
        /***************************************************VALIDATION**********************************************/
        if(!Object.keys(req.body).length) return res.status(406).send({status: false, msg: "No data provided to update."})

        if(!req.params.blogId.match(checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        return res.send({status: false, msg: "Send a valid Blog ObjectId in params."})

        let findBlog = await blog.findOne({_id:req.params.blogId, isDeleted: false})
        if(!findBlog)
        return res.status(404).send({status: false, msg: "No such documents found"})
        /******************************Authentication Check*****************************/
        if(req.headers['Author-login'] != findBlog.authorId)
        return res.status(401).send({status: false, msg: "You can't update this Blog."})
        /*********************************************************************************/
        let {title, body, tags, subcategory} = req.body
        if(!req.body) return res.status(400).send({status: false, msg: "You must enter data which you want to update."})
        let updatedblog = await blog.findOneAndUpdate({_id: req.params.blogId},
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
        if (!req.params.blogId.match(/^[0-9a-fA-F]{24}$/)) 
            return res.status(404).send({status:false, data:'Invalid objectId given in params'}) 
        /******************************Authentication Check*****************************/
        let authCheck = await blog.findById(req.params.blogId)
        if(authCheck.authorId != req.headers['Author-login'])
            return res.status(401).send({status: false, msg: "You don't have authority to delete this Blog."})
        /*********************************************************************************/
        let blogData =  await blog.findOne({_id:req.params.blogId})
        if(blogData){
            await blog.findOneAndUpdate({_id:req.params.blogId},{isDeleted:true})
            res.status(200).end();
        }else{
            res.status(404).send({status:false, data:null})
        }
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
        /******************************Authentication Check*****************************/
        req.query.isPublished = false
        let findBlogs = (await blog.find(req.query)).filter(x => x.authorId == req.headers['Author-login'])
        if(!findBlogs.length) return res.status(404).send({status: false, msg: "No document found"})
        /*********************************************************************************/
        let blogs = await blog.updateMany({_id: findBlogs},{isDeleted:true})
        console.log(blogs)
        if(blogs.matchedCount == 0) 
        return res.status(404).send({status:false, data: "document not found."})
        res.status(200).send({status: true, data: `Total deleted document count: ${blogs.modifiedCount}`});
    }
    catch(err){
        console.log(err)
        res.status(500).send({status:false, msg: err.message})
    }
}

module.exports = {getBlogs,createBlogs,updateBlogs,deleteBlogs,deleteBlogsQP}


