import mongoose, { Schema } from "mongoose";


const meetingSchema = new Schema(
    {
        user_id: { type: String },
        meetingCode: { type: String, required: true, index: true },
        title: { type: String, trim: true, default: "MyVideo Meeting" },
        meetingType: { type: String, enum: ["instant", "scheduled", "history"], default: "history" },
        scheduledFor: { type: Date },
        status: { type: String, enum: ["created", "scheduled", "ended"], default: "created" },
        date: { type: Date, default: Date.now, required: true }
    },
    { timestamps: true }
)

meetingSchema.index({ user_id: 1, date: -1 });
meetingSchema.index({ user_id: 1, scheduledFor: 1 });

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
