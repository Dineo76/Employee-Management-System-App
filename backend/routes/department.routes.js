const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const prisma = new PrismaClient();

// Get all departments
router.get('/', auth, async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: { employees: true }
        }
      }
    });
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single department
router.get('/:id', auth, async (req, res) => {
  try {
    const department = await prisma.department.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        employees: {
          include: {
            department: true
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create department (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if department already exists
    const existingDept = await prisma.department.findUnique({
      where: { name }
    });

    if (existingDept) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const department = await prisma.department.create({
      data: {
        name,
        description
      }
    });

    res.status(201).json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update department (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const { name, description } = req.body;

    const department = await prisma.department.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete department (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    // Check if department has employees
    const employees = await prisma.employee.findMany({
      where: { departmentId: parseInt(req.params.id) }
    });

    if (employees.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete department with employees. Reassign or delete employees first.'
      });
    }

    const department = await prisma.department.delete({
      where: { id: parseInt(req.params.id) }
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
