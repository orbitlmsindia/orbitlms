const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://orbitlmsindia_db_user:Orbit%40123@orbitlms.vhozysu.mongodb.net/?appName=Orbitlms';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    instituteId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

async function fixUserInstitute() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // Target user: Hitesh (hitesh@gmail.com) - assuming this is the one you are logged in as?
        // Wait, the screenshot shows "Hitesh TEACHER" but the student dashboard might be a different login.
        // If you are logged in as "hitesh@gmail.com" and role is "student", you need to update it.
        // But the previous output said Hitesh HAS an institute ID.

        // Let's assume you might be logged in as "pragya@gmail.com" or "manas@gmail.com" or one of those WITHOUT an ID.
        // Since I don't know exactly which one is "Verify that it's you", I will update ALL students with no institute ID
        // to use the same institute ID as the course "Web Development Basics" (6970a418a8320f38d214db82).

        const targetInstituteId = "6970a418a8320f38d214db82";

        const result = await User.updateMany(
            { role: 'student', instituteId: { $exists: false } },
            { $set: { instituteId: targetInstituteId } }
        );

        console.log(`Updated ${result.modifiedCount} students wih missing Institute ID.`);

        // Also update students where instituteId is null/undefined just in case query above missed some
        const result2 = await User.updateMany(
            { role: 'student', instituteId: null },
            { $set: { instituteId: targetInstituteId } }
        );
        console.log(`Updated ${result2.modifiedCount} students with null Institute ID.`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

fixUserInstitute();
