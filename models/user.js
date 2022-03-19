const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userImg: {
        data: Buffer,
        contentType: String
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Minimum password length is 8 characters']
    },
    tasks: {
        type: Array
    },
    courses: {
        type: Array
    }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
  
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user)
    {
        const auth = await bcrypt.compare(password, user.password);
        if(auth)
        {
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('users', userSchema);
module.exports = User;