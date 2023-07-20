const express = require("express");
const uuid = require("uuid");
const qrCode = require("qrcode");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const router = express.Router();
const Event = require("../models/event.model");
const Attendance = require("../models/attendance.model");
const Registration = require("../models/registration.model");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");
    if (isValid) {
      error = null;
    }
    cb(null, "./public/images/event-logo");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

const upload = multer({ storage: storage });

function deleteImage(image){
  const imagePath = image;
    // Use the replace() method with a regular expression to remove the "http://localhost:3000/" part
    const trimmedImagePath = imagePath.replace(/^http:\/\/localhost:3000\//, "");
    fs.unlink(trimmedImagePath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        // Handle the error here, such as sending an error response to the client.
      } else {
        console.log('Image deleted successfully.');
        // Optionally, you can send a success response to the client.
      }
    });
}

// Add Event
router.post("/add-event", upload.single("image"), async (req, res) => {
  try {
    const { name, description, date, startTime, endTime, venue, location, type } =
      req.body;
    const url = req.protocol + "://" + req.get("host");
    const refererHeader = req.headers.referer;
    let baseUrl = "http://localhost:4200/";
    if (refererHeader) {
      const refererUrl = new URL(refererHeader);
      baseUrl = `${refererUrl.protocol}//${refererUrl.host}/`;
    }
    const appUrl = `${baseUrl}login/events`;
    // Generate unique event ID
    const id = generateId();
    const qrCodeData = `${appUrl}?id=${id}`;
    const registerUrl = `${baseUrl}register?id=${id}`;

    // Generate QR code
    const qrCodeImage = await qrCode.toDataURL(qrCodeData);
    // Save event with QR code and ID in database
    const event = new Event({
      id,
      name,
      description,
      date,
      startTime,
      endTime,
      venue,
      location,
      type,
      image: url + "/public/images/event-logo/" + req.file.filename,
      qrCode: qrCodeImage,
    });
    const attendance = new Attendance({ eventId: id, employees: [] });
    const registration = new Registration({eventId: id, employees:[]});
  
    await attendance.save();
    await registration.save();
    await event.save();

    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: 'mrrbajaj44@gmail.com',
        pass: 'fqtswwrgnxzsvkda',
      }
    });

    let mailDetails = {
      from: "mrrbajaj44@gmail.com",
      to: "shubhambajaj90495@gmail.com",
      subject: `Event ${event.name} Registration`,
      text:`Dear Shubham Bajaj,\n\nWe invite you to register for the event. Please click on the following link to complete your registration: ${registerUrl}\n\nThank you.`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error Occurs");
      } else {
        console.log("Email sent successfully");
      }
    });

    res.status(201).json({ message: "Event added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Edit event
router.put("/edit-event/:eventId", upload.single("image"), async (req, res) => {
  try {
    const { eventId } = req.params;
    const updatedEvent = req.body;
    const id = eventId;
    const url = req.protocol + "://" + req.get("host");
    const finalData = {
      id,
      ...updatedEvent,
      image: url + "/public/images/event-logo/" + req.file.filename,
    };
    let eventData = await Event.findOne({ id });
    deleteImage(eventData.image);
    const event = await Event.findByIdAndUpdate(eventData._id, finalData, {
      new: true,
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Delete event
router.delete("/delete-event/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    let eventData = await Event.findOne({ id: eventId });
    let attendanceData = await Attendance.findOne({ eventId });
    let registrationData = await Registration.findOne({ eventId });
    await Event.findByIdAndDelete(eventData._id);
    await Attendance.findByIdAndDelete(attendanceData._id);
    await Registration.findByIdAndDelete(registrationData._id);
    deleteImage(eventData.image);

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get Upcoming Events
router.get("/upcoming-event", async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) {
      filter.date = {
        $gte: new Date(date),
      };
    }
    const events = await Event.find(filter);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get Past Events
router.get("/past-event", async (req, res) => {
  try {
    const { date } = req.query;
    const filter = {};
    if (date) {
      filter.date = {
        $lte: new Date(date),
      };
    }
    const events = await Event.find(filter);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get event by an ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const event = await Event.findOne({ id });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to save attendance for an event
router.post("/attendance/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email, time } = req.body;
    // Find the event by ID
    const attendance = await Attendance.findOne({ eventId });

    // Check if the event exists
    if (!attendance) {
      return res.status(404).json({ error: "Event not found" });
    }

    //Check if the user already attended
    const emailExists = attendance.employees.some((emp) => emp.email === email);
    if (emailExists) {
      return res.json({ message: "Already attended" });
    }
    // Add the attended employee
    attendance.employees.push({ email, time });

    // Save
    await attendance.save();

    res.json({ message: "Attendance saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Router to post registration for event
router.post("/register/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { email } = req.body;
    
    // Find the event by ID
    const registration = await Registration.findOne({ eventId });

    // Check if the event exists
    if (!registration) {
      return res.status(404).json({ error: "Event not found" });
    }

    //Check if the user already attended
    const emailExists = registration.employees.some((emp) => emp.email === email);
    if (emailExists) {
      return res.json({ message: "Already registered" });
    }
    // Add the attended employee
    registration.employees.push({ email });

    // Save
    await registration.save();

    res.json({ message: "Registered event successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get Attended EventsInfo by employee email
router.get("/attendance/employee/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const attendanceResults = await Attendance.find(
      { "employees.email": email },
      "eventId employees"
    ).exec();
    const eventIds = attendanceResults.map((result) => result.eventId);
    const eventResults = await Event.find(
      { id: { $in: eventIds } },
      "id name date"
    ).exec();
    const eventDetails = eventResults.map((event) => {
      const attendance = attendanceResults.find(
        (attendance) => attendance.eventId === event.id
      );
      return {
        name: event.name,
        date: event.date,
        time: attendance
          ? attendance.employees.find((employee) => employee.email === email)
              .time
          : null,
      };
    });
    res.status(200).json(eventDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: message.error });
  }
});

//Get Registered EventsInfo by Employee email
router.get("/register/employee/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const registrationResults = await Registration.find(
      { "employees.email": email },
      "eventId employees"
    ).exec();
    const eventIds = registrationResults.map((result) => result.eventId);
    const eventResults = await Event.find(
      { id: { $in: eventIds } },
      "id name date"
    ).exec();
    const eventDetails = eventResults.map((event) => {
      return {
        name: event.name,
        date: event.date
      };
    });
    res.status(200).json(eventDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: message.error });
  }
});

//Get Attendance of an event
router.get("/attendance/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    // Find the event by ID
    const attendance = await Attendance.findOne({ eventId });

    // Check if the event exists
    if (!attendance) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get Registration of an event
router.get("/register/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    // Find the event by ID
    const registration = await Registration.findOne({ eventId });

    // Check if the event exists
    if (!registration) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateId() {
  return uuid.v4().substring(0, 8);
}

module.exports = router;
