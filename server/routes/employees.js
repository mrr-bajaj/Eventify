const express = require('express');
const router = express.Router();
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
    const modifiedData = admin.map(({email,name})=>({email,name}));
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
    const employee = await Employee.findOneAndUpdate(
      { email: email },
      { $pull: { roles: 'admin' } },
      { new: true });
      res.json({message: 'Admin role deleted'});
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
    res.json({name:employee.name,email:employee.email});
  } catch (error) {
    console.error(error);
    res.status(500).json({error:error.message });
  }
});

module.exports = router;
