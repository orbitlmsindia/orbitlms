const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://orbitlmsindia_db_user:Orbit%40123@orbitlms.vhozysu.mongodb.net/?appName=Orbitlms';

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
});

const courseSchema = new mongoose.Schema({
    title: String,
    _id: mongoose.Schema.Types.ObjectId
});

const enrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    status: String
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const courses = await Course.find({});
        console.log('--- COURSES ---');
        courses.forEach(c => console.log(`${c._id}: ${c.title}`));

        const students = await User.find({ role: 'student' });
        console.log('\n--- STUDENTS ---');
        students.forEach(s => console.log(`${s._id}: ${s.name} (${s.email})`));

        const enrollments = await Enrollment.find({});
        console.log('\n--- ENROLLMENTS ---');
        enrollments.forEach(e => console.log(`Student: ${e.student} -> Course: ${e.course}`));

        if (enrollments.length === 0) {
            console.log("\nNO ENROLLMENTS FOUND!");
            // Optional: Create one for testing if students and courses exist
            if (courses.length > 0 && students.length > 0) {
                console.log("Creating a test enrollment...");
                await Enrollment.create({
                    student: students[0]._id,
                    course: courses[0]._id,
                    status: 'active',
                    enrolledAt: new Date(),
                    progress: 0
                });
                console.log("Test enrollment created.");
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
