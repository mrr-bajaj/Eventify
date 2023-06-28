const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');

// SignUp route
router.post('/signup', async (req, res) => {
  try {
    const { empEmail, empPassword,empName } = req.body;
    const emp = await Employee.findOne({empEmail});
    if(emp){
      return res.send({error: 'Email already registered'})
    }
    const hashedPassword = await bcrypt.hash(empPassword, 10);
    const employee = new Employee({ empEmail,empName, empPassword: hashedPassword,roles:['user'] });
    await employee.save();
    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { empEmail, empPassword } = req.body;
    const employee = await Employee.findOne({ empEmail });
    if (!employee) {
      return res.send({ error: 'Email not found' });
    } else {
      const isPasswordValid = await bcrypt.compare(empPassword, employee.empPassword);
      if (!isPasswordValid) {
        return res.send({ error: 'Invalid password' });
      } else {
        const token = jwt.sign({ employeeId: employee._id,roles:employee.roles }, 'secret-key', { expiresIn: '1h' });
        res.status(200).json({ message: 'Successfully Login',token });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
