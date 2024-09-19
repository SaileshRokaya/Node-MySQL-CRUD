const express = require('express');
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');

// Router object
const router = express.Router();

// Routes

// GET request to retrieve all students || GET
router.get('/getAll', getStudents);

// GET Student By ID || GET
router.get('/get/:id', getStudentById)

// Create New Student || POST
router.post('/create', createStudent);

// Update Student || PUT
router.put('/update/:id', updateStudent);

// Delete Student || DELETE
router.delete('/delete/:id', deleteStudent);

module.exports = router;
