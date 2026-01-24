import mongoose from 'mongoose';

const GamificationPointSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, default: 0 },
    badges: [{
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

export default mongoose.models.GamificationPoint || mongoose.model('GamificationPoint', GamificationPointSchema);
