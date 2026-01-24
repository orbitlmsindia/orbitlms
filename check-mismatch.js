const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://orbitlmsindia_db_user:Orbit%40123@orbitlms.vhozysu.mongodb.net/?appName=Orbitlms';

const CourseSchema = new mongoose.Schema({
    title: String,
    status: String,
    instituteId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    instituteId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

async function checkMismatch() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        const courseId = "6971ff62a91867f1aa9e229a";
        const course = await Course.findById(courseId);

        if (!course) {
            console.log("Course NOT found in DB");
            return;
        }
        console.log(`Course: ${course.title} | InstID: ${course.instituteId}`);

        // Find the student (assuming one of the students in the ecosystem)
        // I don't know the student ID, so I'll list all students
        const students = await User.find({ role: 'student' });
        console.log(`Found ${students.length} students:`);
        students.forEach(s => {
            console.log(`Student: ${s.name} (${s.email}) | InstID: ${s.instituteId} | Match? ${s.instituteId && s.instituteId.toString() === course.instituteId.toString()}`);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkMismatch();
