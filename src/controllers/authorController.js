const {author, blog} = require("../models/schemas")

//createAuthor API by Sandeep
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

// Creat Blog by Moulesh_Chavan
// const createBlogs = async (req,res) => {
//         try{
//             let data = req.body
//             if(!await author.findById(req.body.authorId)) 
//             return res.status(208).send({status: false, msg: "Incorrect Author Id"})
//             if(await blog.exists(data)) 
//             return res.status(208).send({status: false, msg: "Blog already present"})
//             let created = await blog.create(data)
//             res.status(201).send({status: true, data: created})
//         }
//         catch(err){
//             console.log(err.message)
//             res.status(500).send({status: false, msg: err.message})
//         }
//     }
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

// createBlog API by Gautam kumar
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

//getBlog by Gautam_Kumar
const getBlogs = async function(req, res){
    // let getAllBlogs = await blog.find({isDeleted: false, isPublished: true})
    // if(getAllBlogs.length === 0) return res.status(404).send({status: false, msg:"document not Found"})
    // console.log(getAllBlogs);
    // res.status(200).send({status:true, msg: getAllBlogs})

   try{
        req.query.isDeleted = false
    req.query.isPublished = true
    let filter = req.query


    let getDetails = await blog.find(filter)
    if(!getDetails.length) return res.status(404).send({status: false, msg:"document not Found"})
    res.status(200).send({status: true, msg: getDetails})
}
catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
}
}

const updateBlogs = async (req,res) => {
    try{
        let findBlog = await blog.find({_id:req.params.blogId, isDeleted: false})
        if(!findBlog.length)
        return res.status(404).send({status: false, msg: "No such documents found"})
        let {title, body, tags, subcategory} = req.body
        let updatedblog = await blog.findOneAndUpdate({_id: req.params.blogId},
                                                    {$push: {tags: tags, subcategory:subcategory},
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



module.exports = {createAuthor, getBlogs,createBlogs,updateBlogs}


// deleteBlogs, deleteBlogsQP
