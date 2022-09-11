const {ObjectId} = require("mongodb")
const connection = require("../database/connect")
const getIndex = (allUsers, val, key) =>{
    const index = allUsers.findIndex(user=> user[key] == val)
    return index
}
class User {
    static add = (req, res)=>{
        if(req.query.name|| req.query.age||req.query.email){
            if(!req.query.name || !req.query.age||!req.query.email){
                const errors={}
                if(!req.query.name) errors.name="please add a name"
                if(!req.query.age) errors.age="please add a age"
                if(!req.query.email) errors.email="please add a email"
                res.render("add", {data:req.query, errors})
            }
            else{
                connection((err, db)=>{
                    db.collection("user").insertOne(req.query)
                    .then(()=> res.redirect("/"))
                    .catch(e=> res.render("err404"))
                })
            }
        }
        else
        res.render("add", {
            pageTitle:"add new user"
        })
    }
    static addPost = (req,res) => {
        res.render("addPost", {pageTitle:"add user post"})
    }
    static addPostLogic = (req, res) =>{
        let errors={}, hasError=false
        if(!req.body.name) {
            errors.name="please add a name"
            hasError=true
        }
        if(!req.body.age){
            errors.age="please add a age"
            hasError=true
        }
        if(!req.body.email) {
            errors.email="please add a email"
            hasError=true
        }
        console.log(errors)
        if( hasError ) {
            return res.render("addPost", {data:req.body, errors})
        }
        connection((err, db)=>{
            if(err) return res.render("/error")
            db.collection("user").insertOne(req.body)
            .then(()=>res.redirect("/"))
            .catch(e=> res.redirect("/error"))
        })
            
    }
    static all = (req, res)=>{
        connection((err, db)=>{
            db.collection("user").find()
            .toArray((e, users)=>{
                if(e) return res.render("err404")
                res.render("all", {
                    pageTitle:"all",
                    users
                })
            })
        })
    }
    static edit =  (req, res)=>{
        const userId = req.params.id
        connection((err, db)=>{
            if(err) return res.send(err.message)
            db.collection("user").findOne({_id:new ObjectId(userId)})
            .then(user=> {
                res.render("edit", {pageTitle:"single", user})
            })
            .catch(e=> res.send(e.message))
        })
    }
    static editLogic = (req, res)=>{
        const userId = req.params.id
        connection((err, db)=>{
            if(err) return res.send(err.message)
            db.collection("user").updateOne(
                {_id:new ObjectId(userId)},
                { $set : req.body }
            )
            .then(user=> {
                res.redirect(`/single/${userId}`)
            })
            .catch(e=> res.send(e.message))
        })
    }
    static single = (req, res)=>{
        const userId = req.params.id
        connection((err, db)=>{
            if(err) return res.send(err.message)
            db.collection("user").findOne({_id:new ObjectId(userId)})
            .then(user=> {
                res.render("single", {pageTitle:"single", user})
            })
            .catch(e=> res.send(e.message))
        })
     }
    static del = (req, res)=>{
        const userId = req.params.id
        connection((err, db)=>{
            if(err) return res.send(err.message)
            db.collection("user").deleteOne({_id:new ObjectId(userId)})
            .then(user=> {
                res.redirect("/")
            })
            .catch(e=> res.send(e.message))
        })
    }
}
module.exports = User