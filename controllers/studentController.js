const db = require('../config/db');

// Get All Students List
const getStudents = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students");  // Use destructuring to get rows
        if (rows.length === 0) {  // Check if no students were found
            return res.status(404).send({
                success: false,
                message: 'No students found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'All Students Records',
            data: rows  // Send rows as data
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error getting students list',
            error: error.message,
        });
    }
};

// GET students by id
const getStudentById = async (req, res) => {
    try {
        const studentId = req.params.id; // Get student ID from request params
        const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [studentId]); // Use parameterized query for security

        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: `Student with ID ${studentId} not found`,
            });
        }

        res.status(200).send({
            success: true,
            message: `Student with ID ${studentId} found`,
            data: rows[0], // Return the first row, as ID should be unique
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error retrieving student by ID',
            error: error.message,
        });
    }
};

// Create New Student
const createStudent = async (req, res) => {
    const { name, roll_no, fees, class: studentClass, medium } = req.body; // Destructure data from request body

    // Validate input
    if (!name || !roll_no || !fees || !studentClass || !medium) {
        return res.status(400).send({
            success: false,
            message: 'All fields are required',
        });
    }

    try {
        // Insert new student into the database
        const [result] = await db.query(
            'INSERT INTO students (name, roll_no, fees, class, medium) VALUES (?, ?, ?, ?, ?)',
            [name, roll_no, fees, studentClass, medium]
        );

        res.status(201).send({
            success: true,
            message: 'Student created successfully',
            data: {
                id: result.insertId,
                name,
                roll_no,
                fees,
                class: studentClass,
                medium,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error creating student',
            error: error.message,
        });
    }
};


// Update Student
const updateStudent = async (req, res) => {
    const studentId = req.params.id; // Get student ID from request params
    const { name, roll_no, fees, class: studentClass, medium } = req.body; // Destructure data from request body

    // Validate input
    if (!name && !roll_no && !fees && !studentClass && !medium) {
        return res.status(400).send({
            success: false,
            message: 'At least one field must be provided for update',
        });
    }

    try {
        // Prepare the update query
        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (roll_no) {
            updates.push('roll_no = ?');
            values.push(roll_no);
        }
        if (fees) {
            updates.push('fees = ?');
            values.push(fees);
        }
        if (studentClass) {
            updates.push('class = ?');
            values.push(studentClass);
        }
        if (medium) {
            updates.push('medium = ?');
            values.push(medium);
        }

        // Add the student ID to the values array
        values.push(studentId);

        // Execute the update query
        const query = `UPDATE students SET ${updates.join(', ')} WHERE id = ?`;
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: `Student with ID ${studentId} not found`,
            });
        }

        res.status(200).send({
            success: true,
            message: 'Student updated successfully',
            data: {
                id: studentId,
                name,
                roll_no,
                fees,
                class: studentClass,
                medium,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error updating student',
            error: error.message,
        });
    }
};

// Delete Student
const deleteStudent = async (req, res) => {
    const studentId = req.params.id; // Get student ID from request params

    try {
        // Execute the delete query
        const [result] = await db.query('DELETE FROM students WHERE id = ?', [studentId]);

        if (result.affectedRows === 0) {
            return res.status(404).send({
                success: false,
                message: `Student with ID ${studentId} not found`,
            });
        }

        res.status(200).send({
            success: true,
            message: 'Student deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting student',
            error: error.message,
        });
    }
};


module.exports = { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };
