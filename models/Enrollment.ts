import mongoose from 'mongoose';

const EnrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    progress: {
        type: Number,
        default: 0,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedLessons: [{
        type: String // Store lesson IDs
    }],
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Ensure a student can only enroll in a course once
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Force model recompilation to pick up schema changes in dev mode
if (mongoose.models.Enrollment) {
    delete mongoose.models.Enrollment;
}

export default mongoose.model('Enrollment', EnrollmentSchema);
