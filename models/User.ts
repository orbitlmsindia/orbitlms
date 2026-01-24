import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin', 'manager'],
        default: 'student',
    },
    status: {
        type: String,
        default: 'active',
    },
    image: String,
    collegeName: {
        type: String,
        default: '',
    },
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
    },
    instituteName: {
        type: String,
        default: '',
    },
    joinedDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Force model recompilation to pick up schema changes in dev mode
if (mongoose.models.User) {
    delete mongoose.models.User;
}

export default mongoose.model('User', UserSchema);
