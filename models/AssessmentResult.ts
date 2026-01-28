import mongoose from 'mongoose';

const AssessmentResultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assessment: {
        type: String, // Changed to String to support static quiz IDs
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'failed', 'passed'],
        required: true,
        default: 'in-progress'
    },
    answers: [{
        questionId: String,
        selectedOption: Number,
        isCorrect: Boolean
    }],
    startedAt: {
        type: Date,
        default: Date.now,
    },
    completedAt: Date,
    attemptedAt: { // Legacy, same as startedAt usually
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

export default mongoose.models.AssessmentResult || mongoose.model('AssessmentResult', AssessmentResultSchema);
