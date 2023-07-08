const express = require('express');
const uuid = require('uuid');
const qrCode = require('qrcode');
const multer = require('multer');
const router = express.Router();
const Event = require('../models/event.model');


const MIME_TYPE_MAP = {  
  'image/png': 'png',  
  'image/jpeg': 'jpg',  
  'image/jpg': 'jpg'  
};  

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Mime Type");  
    if(isValid){  
      error = null;  
    }    
    cb(null, './public/images/event-logo');
  },
  filename: (req, file, cb)=>{  
    const name = file.originalname.toLowerCase().split(' ').join('_');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name+ '-'+ Date.now()+ '.'+ ext);
 }  
});

const upload = multer({ storage: storage });

// Add Event
router.post('/add-event',upload.single('image'), async (req, res) => {
  try {
    const { name, description, date, startTime,endTime,location,type } = req.body;
    const url = req.protocol + '://'+ req.get("host"); 
    // Generate unique event ID
    const id = generateId();
    
    // Generate QR code
    const qrCodeImage = await qrCode.toDataURL(id);
    // Save event with QR code and ID in database
    const event = new Event({
      id,
      name,
      description,
      date,
      startTime,
      endTime,
      location,
      type,
      image:url + "/public/images/event-logo/" + req.file.filename,
      qrCode: qrCodeImage,
    });
    await event.save();

    res.status(201).json({message: 'Event added successfully'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

//Get Upcoming Events
router.get('/upcoming-event',async (req ,res)=> {
  try{
    const {date} = req.query;
    const filter = {};
    if(date){
      filter.date = {
        $gte : new Date(date)
      }
    }
    const events =await Event.find(filter);
    res.json(events);
  }catch(error){
    res.status(500).json({error: error.message});
  }
})

//Get Past Events
router.get('/past-event',async (req ,res)=> {
  try{
    const {date} = req.query;
    const filter = {};
    if(date){
      filter.date = {
        $lte : new Date(date)
      }
    }
    const events =await Event.find(filter);
    res.json(events);
  }catch(error){
    res.status(500).json({error: error.message});
  }
})

function generateId() {
  return uuid.v4().substring(0, 8);
}

module.exports = router;
