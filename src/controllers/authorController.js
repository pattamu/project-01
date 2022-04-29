const author = require("../models/authorModel")

const createAuthor = async (req,res) => {
    try{
        /**************************************VALIDATION********************************************/
        let data = req.body
        if(!Object.keys(data).length) return res.status(406).send({status: false, msg: "You must enter data."})

        if(!data.fname.match(/^[a-zA-Z]+$/)) // REGEX using .match()
        return res.status(422).send({status: false, msg: "Enter a valid First name."})
        
        if(!(/^[a-zA-Z]+$/.test(data.lname))) // REGEX using .test()
        return res.status(422).send({status: false, msg: "Enter a valid Last name."})

        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim())))
        return res.status(422).send({status: false, msg: "Enter a valid email address."})
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


