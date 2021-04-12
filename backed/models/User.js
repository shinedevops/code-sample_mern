const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        required: true,
    }
});

UserSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true,
});

UserSchema.pre('save', function(next){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) throw err;
            this.password = hash;
            next();
        });
    });
});

UserSchema.pre('updateOne', function(next){
    if (this._update.$set.password) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(this._update.$set.password, salt, (err, hash) => {
                if (err) throw err;
                this._update.$set.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

module.exports = User = mongoose.model("users", UserSchema);