import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [{ type: String }], // Optional for subjective/coding
    correctAnswer: { type: Number }, // Index of the correct option
    marks: { type: Number, default: 1 },
    type: { type: String, enum: ['mcq', 'subjective', 'coding'], default: 'mcq' }
});

const AssessmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    type: { type: String, enum: ['quiz', 'test', 'exam', 'assignment', 'coding'], default: 'quiz' },
    questions: [QuestionSchema],
    duration: Number, // Legacy
    timeLimit: Number, // Explicit time limit in minutes
    dueDate: Date,
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true,
    },
    instituteName: String,
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    }
}, { timestamps: true });

export default mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
