import express from 'express';
import { Meeting } from '../models/meeting.model.js';
import { User } from '../models/user.model.js';

const router = express.Router();

const generateMeetingCode = () => Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 6);

const getBaseUrl = (req) => {
    const clientUrl = req.get("origin") || `${req.protocol}://${req.get("host")}`;
    return clientUrl.replace(/\/$/, "");
};

const getUserFromToken = async (token) => {
    if (!token) return null;
    return User.findOne({ token });
};

// Create a new meeting
router.post('/create', async (req, res) => {
    const { token, title, scheduledFor, meetingCode } = req.body;

    try {
        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const code = meetingCode || generateMeetingCode();
        const scheduleDate = scheduledFor ? new Date(scheduledFor) : null;

        if (scheduledFor && Number.isNaN(scheduleDate.getTime())) {
            return res.status(400).json({ message: 'Scheduled time is invalid' });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: code,
            title: title?.trim() || "MyVideo Meeting",
            meetingType: scheduleDate ? "scheduled" : "instant",
            scheduledFor: scheduleDate,
            status: scheduleDate ? "scheduled" : "created"
        });

        await newMeeting.save();
        res.status(201).json({
            message: scheduleDate ? 'Meeting scheduled successfully!' : 'Meeting created successfully!',
            meeting: newMeeting,
            code,
            link: `${getBaseUrl(req)}/${code}`
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating meeting' });
    }
});

router.get('/mine', async (req, res) => {
    const { token } = req.query;

    try {
        const user = await getUserFromToken(token);
        if (!user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const meetings = await Meeting
            .find({ user_id: user.username, meetingType: { $in: ["instant", "scheduled"] } })
            .sort({ scheduledFor: 1, createdAt: -1 })
            .limit(20);

        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: 'Error loading meetings' });
    }
});

export default router;
