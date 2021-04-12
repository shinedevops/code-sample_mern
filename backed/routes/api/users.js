const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');
const validateUpdateUserInput = require('../../validations/updateUser');
const validateResetPasswordInput = require('../../validations/reset-password');
const User = require('../../models/User');
const authenticateJwt = require('../../middlewares/authenticateJwt');
const transport = require('../../nodemailer/nodemailer');
const Token = require('../../models/Token');

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
                    role : req.body.role ? req.body.role : "User",
                });
                newUser.save()
                    .then(response => {
                        return res.status(201).json({ message: "User added successfully!" });
                    })
                    .catch(err => console.log(err));
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
    User.findOne({ email , role: "Admin"}).then(user => {
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
    User.countDocuments({ role: { $ne: "Admin" } }).then(count=>{
        return res.status(200).json({ count });
    });
});

router.get('/get-users', authenticateJwt,(req, res) => {
    User.find({ role : { $ne : "Admin" } }).select(['-password']).then(users => {
        return res.status(200).json({ users });
    });
});

router.delete('/delete-user/:id', authenticateJwt, (req, res) => {
    const { id } = req.params;
    User.deleteOne({ _id: id }).then(response => {
        return res.status(200).json({ message: 'User deleted successfully.' });
    });
});

router.get('/get-user-detail/:id', authenticateJwt, (req, res) => {
    const { id } = req.params;
    User.findOne({ _id: id }).select(['-password']).then(user => {
        if(user){
            return res.status(200).json({ user });
        }else{
            return res.status(400).json({ message: "User not found!" });
        }
    });
});

router.get('/get-logged-in-user-detail', authenticateJwt, (req, res) => {
    const { id } = req.user;
    User.findOne({ _id: id }).select(['-password']).then(user => {
        if(user){
            return res.status(200).json({ user });
        }else{
            return res.status(400).json({ message: "User not found!" });
        }
    });
});

router.put('/update-user', authenticateJwt, (req, res) => {
    const { errors, isValid } = validateUpdateUserInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    const { id } = req.body;
    User.findOne({ email: req.body.email, _id: { $ne: id } }).then(user => {
        if(user){
            return res.status(400).json({ message: "This email is associated with some other account." });
        }else{
            User.findOne({ _id: id }).then(user => {
                if(user){
                    let { name, email, phone, password } = req.body;
                    let setObj = req.body.password ? { name, email, phone, password } : { name, email, phone };
                    User.updateOne({ _id: id }, { $set: setObj }, (err, result) => {
                        if(err){
                            return res.status(500).json({ message: 'Some Error Occured while updating User.' });
                        }else{
                            return res.status(200).json({ message: 'User updated successfully.', success: true });
                        }
                    });
                }else{
                    return res.status(404).json({ message: 'User Not Found!' });
                }
            })
        }
    })
});

router.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    if(!email){
        return res.status(400).json({ message: "Email is required." });
    }

    User.findOne({ email, role: "Admin" }).then(user => {
        if(user){
            const url = "http://localhost:3000/reset-password/"
            Token.findOne({ userId: user._id }).then(token => {
                if(token){
                    token.deleteOne();
                }
                let resetToken = crypto.randomBytes(32).toString("hex");
                let tokenn = new Token({
                    userId: user._id,
                    token: resetToken,
                    createdAt: Date.now(),
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(resetToken, salt, (err, hash) => {
                        if (err) throw err;
                        tokenn.token = hash;
                    });
                });
                tokenn.save();
                const link = url+tokenn.token;
                const mailOptions = {
                    from: 'akarshan.shinedezign@gmail.com',
                    to: user.email,
                    subject: `Reset Password Email`,
                    text: `Hi ${user.name}, to reset the password please visit ${link}. This link will expire in 1 Hour.`
                };
                transport.sendMail(mailOptions, function(error, info){
                    if (error) {
                        return res.status(400).json({ message: "Some Error Occured" });
                    } else {
                        return res.status(200).json({ message: "Email sent successfully. Please open the  link in the email to reset the password." });
                    }
                });
            })
        }else{
            return res.status(404).json({ message: "User not found!" });
        }
    });
});

router.get('/verify-token/:token', (req, res) => {
    const { token } = req.params;
    Token.findOne({ token }).then(token=>{
        if(token){
            return res.status(200).json({ message : 'Token is valid.' });
        }else{
            return res.status(400).json({ message : "Token is invalid or expired." });
        }
    })
})

router.post('/reset-password', (req, res) => {
    const { errors, isValid } = validateResetPasswordInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }

    const { token, password } = req.body;
    Token.findOne({ token }).then(token=>{
        if(token){
            User.findOne({ _id: token.userId, role: "Admin" }).then(user => {
                if(user){
                    User.updateOne({ _id: user._id }, { $set : { password: password } }, (err, result) => {
                        if(err){
                            return res.status(500).json({ message : "Some error occured. Please try again later." });
                        }else{
                            token.deleteOne();
                            return res.status(200).json({ message : "Password updated successfully." });
                        }
                    })
                }else{
                    return res.status(400).json({ message : "Token is invalid or expired." });
                }
            })
        }else{
            return res.status(400).json({ message : "Token is invalid or expired." });
        }
    })
})

module.exports = router;