require('dotenv').config();
const mongoString = 'mongodb+srv://shubhambajaj90495:MMd31XWOOfQ0X9HC@cluster0.uy2rw8w.mongodb.net/eventify?retryWrites=true&w=majority'
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
