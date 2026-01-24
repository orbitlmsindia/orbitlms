import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: String,
    fileUrl: String,
    grade: Number,
    feedback: String,
    status: {
        type: String,
        enum: ['pending', 'graded'],
        default: 'pending',
    },
}, { timestamps: true });

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
