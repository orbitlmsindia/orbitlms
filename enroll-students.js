const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://orbitlmsindia_db_user:Orbit%40123@orbitlms.vhozysu.mongodb.net/?appName=Orbitlms';

const enrollmentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    status: String,
    enrolledAt: Date,
    progress: Number
});

const userSchema = new mongoose.Schema({
    role: String
}); // min schema

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const User = mongoose.model('User', userSchema);

const COURSE_ID = '6979c3867a6c3a2e3816800b'; // Web Devlopment

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        // Get all students
        const students = await User.find({ role: 'student' });
        console.log(`Found ${students.length} students.`);

        for (const student of students) {
            const exists = await Enrollment.findOne({ student: student._id, course: COURSE_ID });
            if (!exists) {
                console.log(`Enrolling student ${student._id} into course ${COURSE_ID}...`);
                await Enrollment.create({
                    student: student._id,
                    course: COURSE_ID,
                    status: 'active',
                    enrolledAt: new Date(),
                    progress: 0
                });
                console.log('Done.');
            } else {
                console.log(`Student ${student._id} already enrolled.`);
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
