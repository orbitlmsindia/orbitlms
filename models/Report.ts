import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a report title"],
    },
    type: {
        type: String,
        enum: ["PDF", "CSV", "Excel"],
        default: "PDF",
    },
    generatedBy: {
        type: String, // Storing the name or ID related string
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Failed"],
        default: "Completed",
    },
    url: {
        type: String,
        default: "#",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
