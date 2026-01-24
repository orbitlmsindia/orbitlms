import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }, // Index of the correct option
});

const AssessmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    type: { type: String, enum: ['quiz', 'test', 'exam'], default: 'quiz' },
    questions: [QuestionSchema],
    duration: Number, // in minutes
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true,
    },
    instituteName: String,
}, { timestamps: true });

export default mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
