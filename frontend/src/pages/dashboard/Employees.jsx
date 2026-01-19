import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    position: '',
    employeeNo: ''
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [empRes, deptRes] = await Promise.all([
        axios.get('http://localhost:4000/api/employees', { headers }),
        axios.get('http://localhost:4000/api/departments', { headers })
      ]);

      setEmployees(empRes.data.employees);
      setDepartments(deptRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: name === 'departmentId' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.departmentId) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        // Update existing employee
        await axios.put(`http://localhost:4000/api/employees/${editingId}`, newEmployee, { headers });
      } else {
        // Create new employee
        await axios.post('http://localhost:4000/api/employees', newEmployee, { headers });
      }

      // Refresh list
      fetchData();

      // Reset form
      setNewEmployee({ firstName: '', lastName: '', email: '', departmentId: '', position: '', employeeNo: '' });
      setEditingId(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error saving employee:', err);
      alert(err.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleEditEmployee = (employee) => {
    setNewEmployee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      departmentId: employee.departmentId || (employee.department ? employee.department.id : ''),
      position: employee.position || '',
      employeeNo: employee.employeeNo || ''
    });
    setEditingId(employee.id);
    setShowAddForm(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setNewEmployee({ firstName: '', lastName: '', email: '', departmentId: '', position: '', employeeNo: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData(); // Refresh list
      } catch (err) {
        console.error('Error deleting employee:', err);
        alert(err.response?.data?.message || 'Failed to delete employee');
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Loading employees...</div>;

  return (
    <div className="employees-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#2E7D32' }}>Employee Management</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setNewEmployee({ firstName: '', lastName: '', email: '', departmentId: '', position: '', employeeNo: '' });
            setShowAddForm(!showAddForm);
          }}
          className="btn btn-success"
          style={{
            backgroundColor: '#4CAF50',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <i className={`bi ${showAddForm ? 'bi-dash-lg' : 'bi-plus-lg'}`}></i>
          <span>{showAddForm ? 'Cancel' : 'Add Employee'}</span>
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">{editingId ? 'Edit Employee' : 'Add New Employee'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={newEmployee.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={newEmployee.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter last name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Employee No</label>
                  <input
                    type="text"
                    className="form-control"
                    name="employeeNo"
                    value={newEmployee.employeeNo}
                    onChange={handleInputChange}
                    placeholder="Enter employee ID"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    name="departmentId"
                    value={newEmployee.departmentId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-control"
                    name="position"
                    value={newEmployee.position}
                    onChange={handleInputChange}
                    placeholder="Enter position"
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.departmentId}
                >
                  {editingId ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {employees.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted mb-3"></i>
              <p className="text-muted">No employees found. Add your first employee to get started.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.employeeNo || emp.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar me-2" style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#E8F5E9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#2E7D32',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            {emp.firstName?.[0] || ''}{emp.lastName?.[0] || ''}
                          </div>
                          <span>{emp.firstName} {emp.lastName}</span>
                        </div>
                      </td>
                      <td>{emp.email}</td>
                      <td>
                        <span className="badge bg-success bg-opacity-10 text-success">
                          {emp.department?.name || 'Not Specified'}
                        </span>
                      </td>
                      <td>{emp.position || '-'}</td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                            onClick={() => handleEditEmployee(emp)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDeleteEmployee(emp.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
