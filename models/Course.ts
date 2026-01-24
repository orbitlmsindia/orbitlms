import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['video', 'pdf', 'document', 'quiz', 'text'], default: 'video' },
    content: String, // for text content
    fileName: String, // for file uploads
    fileUrl: String, // for external file links (PDFs, Docs)
    videoUrl: String,
    duration: String,
    isFree: { type: Boolean, default: false },
    order: Number,
});

const ChapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [LessonSchema],
    order: Number
});

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    description: String,
    category: String,
    level: { type: String, default: 'beginner' }, // Added level
    price: { type: Number, default: 0 }, // Added price
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chapters: [ChapterSchema], // Changed from flattened lessons to chapters
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    rating: {
        type: Number,
        default: 0,
    },
    image: String,
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true,
    },
    instituteName: String,
}, { timestamps: true });

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
