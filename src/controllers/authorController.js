const author = require("../models/authorModel")

const createAuthor = async (req,res) => {
    try{
        /**************************************VALIDATION********************************************/
        let data = req.body
        if(!Object.keys(data).length) 
            return res.status(400).send({status: false, msg: "You must enter data."})
        
        if(!data.fname)
            return res.status(400).send({status: false, msg: "First Name must be present."})
        if(!data.fname.trim().match(/^[a-zA-Z]+$/)) // REGEX using .match()
            return res.status(400).send({status: false, msg: "Enter a valid First name."})
        
        if(!data.lname)
            return res.status(400).send({status: false, msg: "Last Name must be present."})
        if(!(/^[a-zA-Z]+$/.test(data.lname.trim()))) // REGEX using .test()
            return res.status(400).send({status: false, msg: "Enter a valid Last name."})

        if(!data.title)
            return res.status(400).send({status: false, msg: 'Title must be present & should be from "Mr", "Mrs", "Miss".'})

        if(!data.email)
            return res.status(400).send({status: false, msg: "E-Mail be present."})
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim())))
            return res.status(400).send({status: false, msg: "Enter a valid email address."})

        if(!data.password)
            return res.status(400).send({status: false, msg: "Password must be present."})
        /********************************************************************************************/
        let created = await author.create(data)
        res.status(201).send({status: true, data: created})
    }
    catch(err){
        console.log(err.message)
        res.status(500).send({status: false, msg: err.message})
    }
}

module.exports = createAuthor


