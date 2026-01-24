import mongoose from 'mongoose';

const InstituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide an institute name'],
        unique: true,
    },
    address: {
        type: String,
        default: '',
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    code: {
        type: String,
        unique: true,
        sparse: true, // Allows null/undefined to be unique (if not required)
    }
}, { timestamps: true });

export default mongoose.models.Institute || mongoose.model('Institute', InstituteSchema);
