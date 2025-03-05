const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cities = require('./Cities');

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        phoneNumber: {
            type: String,
            required: [true, 'Mobile number is required'],
            unique: true,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number'],
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            minlength: [6, 'Enter a valid pincode'],
            maxlength: [6, 'Enter a valid pincode'],
        },
        state: {
            type: String,
            enum: Object.keys(cities),
            required: true,
        },
        city: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return cities[this.state]?.includes(value);
                },
                message: (props) =>
                    `${props.value} is not a valid city for the selected state.`,
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password should be at least 6 characters long'],
        },
        confirmPassword: {
            type: String,
            required: [true, 'Confirm password is required'],
            validate: {
                validator: function (confirmPassword) {
                    return confirmPassword === this.password;
                },
                message: 'Passwords do not match',
            },
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        timestamps: true, // Enables `createdAt` and `updatedAt`
    }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('profile.password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.profile.password = await bcrypt.hash(this.profile.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to check password validity
UserSchema.methods.isValidPassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.profile.password);
};

// Method to generate OTP
UserSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    };
    return otp;
};

// Method to verify OTP
UserSchema.methods.verifyOTP = function (otpCode) {
    if (!this.otp || !this.otp.code) return false;

    const isValid = this.otp.code === otpCode && this.otp.expiresAt > new Date();

    if (isValid) {
        this.otp = undefined;
        this.isVerified = true;
    }

    return isValid;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
