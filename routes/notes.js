const router = require("express").Router();
const Note = require("../DB/models/Note");
const Auth = require("../middlewares/auth");
// GET   All Notes
router.get("/",Auth,(req,res)=>{    
    Note.find({user:req.user.id}).sort({date:"desc"}).then(notes=>{
        res.render("./partials/notes/index",{title:"Notes",notes:notes});
    })
})

// GET Add New Note
router.get("/add",Auth, (req, res) => {
    res.render("./partials/notes/add", { title: "New Note",note:{}});
})

//GET Edit Existing Note
router.get("/edit/:id",Auth,(req,res,next)=>{
    Note.findById(req.params.id).then(note=>{
        if(req.user.id != note.user){
            req.flash("error_msg","UnAuthorized");
            res.redirect("/notes");
        }else{
            res.render("./partials/notes/edit",{title:"Edit Note",note});
        }         
    }).catch(err=>{
        console.log(err);
        const error = new Error("Invalid Object Id");
        next(error);
    })
})

//POST Add New Note
router.post("/",Auth, (req, res) => {
    let errors = [];
    req.body.title =req.body.title.trim(),
    req.body.details=req.body.details.trim();
    if (!req.body.title)
        errors.push("Please enter a title!");
    if (!req.body.details)
        errors.push("Please enter the details!");
    if (errors.length > 0) {
        // errors.forEach(msg=>{
        //     req.flash("error_msg",msg);
        // })
        // let note={title,details};
        // console.log("NOTE IS ",note);
        // let n = JSON.stringify(note);
        // req.flash("note",n);
        res.render("./partials/notes/add",{title:"New Note",note:req.body,errors});
    }
    else {
        const newNote = {
            title:req.body.title,
            details:req.body.details,
            user:req.user.id
        }
        new Note(newNote).save().then(idea=>{
            req.flash("success_msg","Note added successfully");
            res.redirect('/notes');
        })
    }
})

//PUT Update Existing Note
router.put("/edit/:id",Auth,(req,res,next)=>{
    Note.findById(req.params.id).then(note=>{
        let errors = [];
        req.body.title = req.body.title.trim();
        req.body.details = req.body.details.trim();

    if (!req.body.title)
        errors.push("Please enter a valid title!");
    if (!req.body.details)
        errors.push("Please enter the valid details!");
    if (errors.length > 0) {
        res.render("./partials/notes/edit",{title:"Edit Note",errors,note:req.body});
    }else{
        note.title = req.body.title;
        note.details = req.body.details;
        note.save().then(note=>{
            req.flash("success_msg","Note updated successfully");
            res.redirect("/notes");
        })
        }
    }).catch(err=>{
        console.log(err);
        const error = new Error("Bad Request");
        res.status(400);
        next(error);
    })
})
//DELETE Note delete
router.delete("/edit/:id",Auth,(req,res,next)=>{
    Note.findByIdAndDelete({_id:req.params.id})
    .then(doc=>{
        req.flash("success_msg","Note Deleted Successfully");
        res.redirect("/notes");
    })
    .catch(err=>{
        console.log("Error is ",err);
        const error = new Error("Internal Server Error");
        res.status(400);
        next(error);
    })
})
module.exports = router;