const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const User = require('../../models/User');
const authenticateJwt = require('../../middlewares/authenticateJwt');

router.post('/new-user', (req, res)=>{
    const { errors, isValid } = validateRegisterInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then( user => {
            if(user){
                return res.status(400).json({ email: "Email already exists." });
            }else{
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    phone: req.body.phone,
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(response => {
                                return res.status(201).json({ message: "User added successfully!" });
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
});

router.post('/login',(req, res)=>{
    const { errors, isValid } = validateLoginInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if(!user){
            return res.status(404).json({ email : "User not found!" });
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                const payload = {
                    id : user.id,
                    name : user.name
                };
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn : 31556952
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer '+ token
                        });
                    }
                )
            } else {
                return res.status(403).json({ message : 'Incorrect Password.' })
            }
        })
    })
});

router.get('/get-users-count', authenticateJwt,(req, res) => {
    User.countDocuments({}).then(count=>{
        return res.status(200).json({ count });
    });
});

router.get('/get-users', authenticateJwt,(req, res) => {
    User.find({}).select(['-password']).then(users=>{
        return res.status(200).json({ users });
    });
});

router.delete('/delete-user/:id', authenticateJwt, (req, res) => {
    const { id } = req.params;
    User.deleteOne({ _id: id }).then(response => {
        return res.status(200).json({ message: 'User deleted successfully.' })
    });
});

module.exports = router;