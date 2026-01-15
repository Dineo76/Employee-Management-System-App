const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const prisma = new PrismaClient();

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const { department, search, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    
    if (department) {
      where.departmentId = parseInt(department);
    }
    
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { position: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          department: true,
        },
        skip,
        take: parseInt(limit),
        orderBy: { lastName: 'asc' }
      }),
      prisma.employee.count({ where })
    ]);

    res.json({
      employees,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single employee //start from 3,4,5
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        department: true,
      
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create employee (Admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      employeeNo,
      position,
      departmentId,
    } = req.body;

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email }
    });

    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    });

    if (!department) {
      return res.status(400).json({ message: 'Department not found' });
    }

    // Check if manager exists if provided
    if (managerId) {
      const manager = await prisma.employee.findUnique({
        where: { id: managerId }
      });

      if (!manager) {
        return res.status(400).json({ message: 'Manager not found' });
      }
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        employeeNo,
        position,
        department: { connect: { id: departmentId } },
        ...(managerId && { manager: { connect: { id: managerId } } })
      },
      include: {
        department: true,
        manager: true
      }
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      position,
      salary,
      departmentId,
    } = req.body;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!existingEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if email is being changed and already exists
    if (email && email !== existingEmployee.email) {
      const emailExists = await prisma.employee.findUnique({
        where: { email }
      });

      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Check if department exists if being updated
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId }
      });

      if (!department) {
        return res.status(400).json({ message: 'Department not found' });
      }
    }

    // Check if manager exists if being updated
    if (managerId) {
      const manager = await prisma.employee.findUnique({
        where: { id: managerId }
      });

      if (!manager) {
        return res.status(400).json({ message: 'Manager not found' });
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(address && { address }),
        ...(position && { position }),
        ...(salary && { salary: parseFloat(salary) }),
        ...(departmentId && { department: { connect: { id: departmentId } } }),
        ...(managerId !== undefined && {
          manager: managerId ? { connect: { id: managerId } } : { disconnect: true }
        })
      },
      include: {
        department: true,
        manager: true
      }
    });

    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        directReports: true
      }
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if employee has direct reports
    if (employee.directReports.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete employee with direct reports. Reassign or delete them first.'
      });
    }

    await prisma.employee.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Employee removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
