const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employee.model');

// SignUp route
router.post('/signup', async (req, res) => {
  try {
    const { email, password,name,department } = req.body;
    const emp = await Employee.findOne({email});
    if(emp){
      return res.send({error: 'Email already registered'})
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({ email,name,department, password: hashedPassword,roles:['user'] });
    await employee.save();
    res.status(201).json({ message: 'Employee registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.send({ error: 'Email not found' });
    } else {
      const isPasswordValid = await bcrypt.compare(password, employee.password);
      if (!isPasswordValid) {
        return res.send({ error: 'Invalid password' });
      } else {
        const token = jwt.sign({ employeeId: employee._id,roles:employee.roles,email:employee.email }, 'secret-key', { expiresIn: '24h' });
        res.status(200).json({ message: 'Successful Login',token,name: employee.name , roles:employee.roles});
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
