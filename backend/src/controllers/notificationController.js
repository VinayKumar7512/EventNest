import Notification from "../models/Notification.js";
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .populate("booking")
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(notifications);
    } catch (error) {
        console.error("Get notifications error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.json(notification);
    } catch (error) {
        console.error("Mark as read error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { read: true }
        );

        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark all as read error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            user: req.user._id,
            read: false
        });

        res.json({ count });
    } catch (error) {
        console.error("Get unread count error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};