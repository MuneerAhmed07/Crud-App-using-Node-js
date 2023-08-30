const express = require("express");
const router = express.Router();
const users = require("../models/users");
const multer = require("multer");
const fs = require("fs");

//Image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single("image");

// insert an user into database
router.post("/add", upload, (req, res) => {
    const user = new users({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename
    });

    user.save().then(() => {
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect("/");
    }).catch((error) => {
        res.json({ message: error.message, type: 'danger' });
    });
});

//get all users route
router.get("/", (req, res) => {
    const Users = users.find().exec();
    Users.then((Users) => {
        res.render("index", {
            title: "Home Page",
            users: Users
        })
    }).catch((err) => {
        res.json({ message: err.message });
    });
});

router.get("/add", (req, res) => {
    res.render("add_users", { title: "Add Users" });
});

// edit user route
router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    const user = users.findById(id)
        .then((user) => {
            if (!user) {
                res.redirect('/');
            } else {
                res.render('edit_users', {
                    title: 'Edit user',
                    users: user
                });
            }
        })
        .catch((err) => {
            res.redirect('/');
        });
});

// Update user route
router.post("/update/:id", upload, async (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync("./uploads/" + req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else {
        new_image = req.body.old_image;
    }

    let updateUser = await users.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image
    });
    if(updateUser){
        req.session.message = {
            type: "success",
            message: "User updated Successfully"
        }
    }else {
        res.json({message: error.message, type: 'danger'});
    }
    res.redirect("/");
});

// Delete User route
router.get("/delete/:id", async (req, res) => {
    let id = req.params.id;
  
    const user = await users.findByIdAndRemove(id);
  
    if (user) {
      if (user.image != "") {
        fs.unlinkSync("./uploads/" + user.image);
      }
  
      req.session.message = {
        type: "info",
        message: "user Deleted successfully"
      }
      res.redirect("/");
    } else {
      res.json({ message: err.message });
    }
  });

module.exports = router;