const express = require('express');
const router = express.Router();
const mailConfig = require('../config/mailService');
const Employee = require('../models/employee.model');

router.get('/', async (req , res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({error:error.message });
  }
});

//Get all admins
router.get('/admin', async (req,res)=>{
  try{
    const admin = await Employee.find({roles: 'admin'});
    const modifiedData = admin.map(({email,name,gender,department,profileImagePath,location})=>({email,name,gender,profileImagePath,department,location}));
    res.json(modifiedData);
  }catch(error){
    console.error(error);
    res.status(500).json({error:error.message });
  }
});

//Delete admin role by email
router.delete('/admin/:email',async (req,res)=>{
  try{
    const email = req.params.email;
    const adminEmail = req.query.adminEmail;
    const employee = await Employee.findOneAndUpdate(
      { email: email },
      { $pull: { roles: 'admin' } },
      { new: true });

      let mailTransporter = mailConfig;
  
      let mailDetails = {
        from: process.env.ID,
        to: "shubhambajaj90495@gmail.com",
        subject: `Removed Admin Access`,
        text:`Dear Shubham Bajaj,\n\nWe regret to inform you that your Admin role has been removed from the Eventify system by ${adminEmail}. You will no longer have administrative privileges and access to certain features.\n\nThank you,\nTeam Eventify`
      };
  
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
          console.log(err);
          console.log("Error Occurs");
        } else {
          console.log("Email sent successfully");
        }
      });
      res.json({message: 'Admin role deleted'});
  }catch(error){
    console.error(error);
    res.status(500).json({error:error.message });
  }
})

//Add admin role by email
router.put('/admin',async (req,res)=>{
  try{
    const { email,adminEmail } = req.body;
    const employee = await Employee.findOneAndUpdate(
      { email }, { $addToSet: { roles: 'admin' } }, { new: true });
    if (!employee) {
      return res.status(404).json({ error: 'employee not found' });
    }
    let mailTransporter = mailConfig;

    let mailDetails = {
      from: process.env.ID,
      to: "shubhambajaj90495@gmail.com",
      subject: `Received Admin Access`,
      text:`Dear Shubham Bajaj,\n\nYou have been granted privileged admin access to the Eventify system by ${adminEmail}. As an admin, you now have access to powerful features and tools to manage events, users, and more.\n\nThank you,\nTeam Eventify`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error Occurs");
      } else {
        console.log("Email sent successfully");
      }
    });
    res.json({message: 'Admin role added'});
  }catch(error){
    console.error(error);
    res.status(500).json({error:error.message });

  }
})

//Get Employee By Email
router.get('/:email', async (req , res) => {
  try {
    const email = req.params.email;
    const employee = await Employee.findOne({email});
    if(!employee){
      return res.json({message: 'User not found'});
    }
    res.json({
      name:employee.name,
      email:employee.email,
      gender:employee.gender,
      department:employee.department,
      location:employee.location,
      profileImagePath: employee.profileImagePath,});
  } catch (error) {
    console.error(error);
    res.status(500).json({error:error.message });
  }
});

module.exports = router;
