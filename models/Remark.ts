import mongoose from 'mongoose';

const RemarkSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['academic', 'behavioral', 'general'], default: 'general' },
}, { timestamps: true });

export default mongoose.models.Remark || mongoose.model('Remark', RemarkSchema);
