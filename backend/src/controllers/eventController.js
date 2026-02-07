import Event from "../models/Event.js";
export const getEvents = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, location, startDate, endDate } =
      req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ];
    }
    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }
    const events = await Event.find(query).sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Get event error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    console.error("Create event error:", error.message);
    res.status(400).json({ message: "Invalid event data" });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Update event error:", error.message);
    res.status(400).json({ message: "Invalid event data" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (error) {
    console.error("Delete event error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleEventActive = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    event.isActive = !event.isActive;
    await event.save();
    res.json(event);
  } catch (error) {
    console.error("Toggle event error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};