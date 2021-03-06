import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const userSchema = new Schema({
    accessCreateTests: {
        type: Boolean,
        default: false,
    },
    isRegistered: {
        type: Boolean,
        default: false,
    },
    username: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    lastConfirmPass: {
        type: String,
        required: true,
    },
    ikon: {
        type: String,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

userSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (user.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.generateAuthToken = async function () {
    try {
        const user = this;
        const token = jwt.sign({ _id: user.id }, process.env.JWT_KEY);
        user.tokens = user.tokens.concat({ token });
        await user.save();
        return token;
    } catch (error) {
        throw new Error(error);
    }
};

userSchema.statics.findByCredentials = async (login, password) => {
    try {
        const user = await User.findOne({ login });
        if (!user) {
            throw new Error('invalid email or password');
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('invalid email or password');
        }
        return user;
    } catch (error) {
        throw new Error(error);
    }
};

const User = mongoose.model('User', userSchema);

export default User;
