const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://hitesh7678:hitesh123@cluster0.p7x7o.mongodb.net/lms-db?retryWrites=true&w=majority&appName=Cluster0';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    instituteId: mongoose.Schema.Types.ObjectId,
    instituteName: String,
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
    title: String,
    status: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    instituteId: mongoose.Schema.Types.ObjectId,
    instituteName: String,
}, { timestamps: true });

async function debugData() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Define models (checking if they exist first, although in this script they wouldn't)
        const User = mongoose.models.User || mongoose.model('User', UserSchema);
        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

        console.log('\n--- USERS ---');
        const users = await User.find({}).select('name email role instituteId instituteName');
        users.forEach(u => console.log(`${u.role}: ${u.email} | InstId: ${u.instituteId} | InstName: ${u.instituteName}`));

        console.log('\n--- COURSES ---');
        const courses = await Course.find({}).select('title status instituteId instituteName instructor');
        courses.forEach(c => console.log(`Course: ${c.title} | Status: ${c.status} | InstId: ${c.instituteId} | Instructor: ${c.instructor}`));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

debugData();
