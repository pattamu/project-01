const author = require("../models/authorModel")
const blog = require("../models/blogModel")

// ________________________________________________________*************_________________________________________________________________
                            //Create Blog by Moulesh_Chavan

const createBlogs = async (req,res) => {
        try{ 
            /********************************************Authentication************************************************/
            let authorId = req.body.authorId
            let  authorLoggedIn = req.headers['Author-login']
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
//__________________________________________________*************______________________________________________________________
                            //createBlog API by Sandeep

// const createBlogs = async (req,res) => {
//     try{
//         let data = req.body
//         if(!await author.findById(req.body.authorId)) 
//         return res.status(208).send({status: false, msg: "AuthorId is not valid"})
//         if(await blog.exists(data)) 
//         return res.status(208).send({status: false, msg: "Blog already present"})
//         let created = await blog.create(data)
//         res.status(201).send({status: true, data: created})
//     }
//     catch(err){
//         console.log(err.message)
//         res.status(500).send({status: false, msg: err.message})
//     }
// }

// ________________________________________________________*************_________________________________________________________________
                            //   createBlog API by Gautam kumar

// const createBlogs = async function(req, res){
//     try {
//     let getData =  req.body
//     let authorId = getData.authorId
//     console.log(authorId);
//     if(!authorId){
//         return res.status(400).send({status: false, msg: "AuthorId must be present"})
//     }
//     let authorData = await author.findById(authorId)
//     if(!authorData){
//         return res.status(400).send({status: false, msg: "AuthorId must be valid"})
//     }

//     let blogCreated = await blog.create(getData)
//     res.status(201).send({status:true, msg: blogCreated})
// }
// catch(err){
//     console.log(err.message)
//     res.status(500).send({status: false, msg: err.message})
// }
// }

// ________________________________________________________*************_________________________________________________________________
                                    //getBlog API by Sandeep

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
        let filter = await blog.find(req.query)
        if(!filter.length)
        return res.status(404).send({status: false, msg: "No such documents found"})
        res.status(200).send({status: true, data: filter})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

// ________________________________________________________*************_________________________________________________________________
                            //getBlog by Gautam_Kumar

// const getBlogs = async function(req, res){
//     // let getAllBlogs = await blog.find({isDeleted: false, isPublished: true})
//     // if(getAllBlogs.length === 0) return res.status(404).send({status: false, msg:"document not Found"})
//     // console.log(getAllBlogs);
//     // res.status(200).send({status:true, msg: getAllBlogs})

//    try{
//         req.query.isDeleted = false
//     req.query.isPublished = true
//     let filter = req.query


//     let getDetails = await blog.find(filter)
//     if(!getDetails.length) return res.status(404).send({status: false, msg:"document not Found"})
//     res.status(200).send({status: true, msg: getDetails})
// }
// catch(err){
//         console.log(err.message)
//         res.status(500).send({status: false, msg: err.message})
// }
// }

// ________________________________________________________*************_________________________________________________________________
                            // Created by Gautam_Kumar

const updateBlogs = async (req,res) => {
    try{
        /***************************************************VALIDATION**********************************************/
        if(!Object.keys(req.body).length) return res.status(406).send({status: false, msg: "No data provided to update."})

        if(!req.params.blogId.match(checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i))
        return res.send({status: false, msg: "Send a valid Blog ObjectId in params."})

        let findBlog = await blog.findOne({_id:req.params.blogId, isDeleted: false})
        if(!findBlog)
        return res.status(404).send({status: false, msg: "No such documents found"})
        /***********************************************************************************************************/
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

// ________________________________________________________*************_________________________________________________________________
                        // Created by Satyam

const deleteBlogs = async (req, res) => {
    try{
            if (!req.params.blogId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).send({status:false, data:'Invalid objectId given'})         
            }
            let blogData =  await blog.findOne({_id:req.params.blogId})
            if(blogData){
                await blog.findOneAndUpdate({_id: req.params.blogId},{isDeleted:true})
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

// ________________________________________________________*************_________________________________________________________________
                        // delete Blogs by Gautam kumar.

// const deleteBlogs = async (req, res) => {
//     let blogId = req.params.blogId
//     let checkBlog = await blog.find({_id: blogId, isDeleted: false})
//     if(!checkBlog.length) return res.status(404).send({status: false, msg: "You are requested to deleted Blog"})

//     let  blogFinal = await blog.findOneAndUpdate({_id: blogId}, {isDeleted: true}, {new: true})

//     res.status(200).send({status:true, msg: blogFinal})
// }



// ________________________________________________________*************_________________________________________________________________
                                // Created by Satyam

const deleteBlogsQP = async (req,res) => {
    try{
        req.query.isPublished = false
        let data = req.query
        let blogs = await blog.updateMany(data,{isDeleted:true})
        console.log(blogs)
        if(blogs.matchedCount == 0) 
        return res.status(404).send({status:false, data: "document not found."})
        res.status(200).end();
    }
    catch(err){
        console.log(err)
        res.status(500).send({status:false, msg: err.message})
    }
}

// ________________________________________________________*************_________________________________________________________________
                          //Created by Sandeep, Gautam, maulesh

// const deleteBlogsQP = async function(req, res){
//     req.query.isPublished = false
//     let data = req.query

//     let blogs = await blog.updateMany(data, {$set:{isDeleted:true}}, {new:true})
//     console.log(blogs);
    
//     if(blogs.matchedCount == 0) return res.status(404).send({status:false, msg: "Document not found"})
//     req.query.isDeleted = true
//     let blogData = await blog.find(req.query)
//     res.status(200).send({status:true, msg: blogData})
// }

module.exports = {getBlogs,createBlogs,updateBlogs,deleteBlogs,deleteBlogsQP}


