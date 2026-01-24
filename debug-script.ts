import mongoose from 'mongoose';
import User from './models/User';
import Course from './models/Course';
// import Institute from './models/Institute'; // Institute model might be needed if I was using it, but I'll stick to User/Course checks first.
import { connect } from 'mongoose';

const MONGODB_URI = 'mongodb+srv://hitesh7678:hitesh123@cluster0.p7x7o.mongodb.net/lms-db?retryWrites=true&w=majority&appName=Cluster0';

async function debugData() {
    try {
        await connect(MONGODB_URI);
        console.log('--- USERS ---');
        const users = await User.find({}).select('name email role instituteId instituteName');
        users.forEach(u => console.log(`${u.role}: ${u.email} | Institute: ${u.instituteId} (${u.instituteName})`));

        console.log('\n--- COURSES ---');
        const courses = await Course.find({}).select('title status instituteId instituteName instructor');
        courses.forEach(c => console.log(`Course: ${c.title} | Status: ${c.status} | Institute: ${c.instituteId} | Instructor: ${c.instructor}`));

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
}

debugData();
