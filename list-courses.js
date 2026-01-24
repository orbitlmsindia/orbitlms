const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://orbitlmsindia_db_user:Orbit%40123@orbitlms.vhozysu.mongodb.net/?appName=Orbitlms';

const CourseSchema = new mongoose.Schema({
    title: String,
    status: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    instituteId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

async function listCourses() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses:`);
        courses.forEach(c => {
            console.log(`ID: ${c._id} | Title: ${c.title} | Status: ${c.status}`);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

listCourses();
