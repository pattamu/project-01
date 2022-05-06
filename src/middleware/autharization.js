const jwt = require("jsonwebtoken")

let loginAuthor = async function(req, res , next){
    try { 
        let token = req.headers['x-api-key'];

        if(!token) return res.status(401).send( { status: false, msg: "token must be present"});

        let decodedToken = jwt.verify(token, "Best-Author") 

        req.headers['Author-login'] = decodedToken.authorId
        next();
    }
    catch(error){
        res.status(500).send({msg: "Error", error: error})
    }
}

module.exports = loginAuthor