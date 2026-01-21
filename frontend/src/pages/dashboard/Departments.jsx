import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: ''
  });

  const [editingId, setEditingId] = useState(null);

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/departments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('Failed to load departments');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newDepartment.name) return;

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingId) {
        // Update existing department
        await axios.put(`http://localhost:4000/api/departments/${editingId}`, newDepartment, { headers });
      } else {
        // Create new department
        await axios.post('http://localhost:4000/api/departments', newDepartment, { headers });
      }

      // Refresh list
      fetchDepartments();

      // Reset form
      setNewDepartment({ name: '', description: '' });
      setEditingId(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error saving department:', err);
      alert(err.response?.data?.message || 'Failed to save department');
    }
  };

  const handleEditDepartment = (department) => {
    setNewDepartment({
      name: department.name,
      description: department.description || ''
    });
    setEditingId(department.id);
    setShowAddForm(true);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setNewDepartment({ name: '', description: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  // ... (handleDeleteDepartment stays the same) ...

  const handleDeleteDepartment = async (id) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/departments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchDepartments(); // Refresh list
      } catch (err) {
        console.error('Error deleting department:', err);
        alert(err.response?.data?.message || 'Failed to delete department');
      }
    }
  };

  if (loading) return <div className="p-4 text-center">Loading departments...</div>;

  return (
    <div className="departments-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#2E7D32' }}>Department Management</h2>
        <button
          onClick={() => {
            setEditingId(null);
            setNewDepartment({ name: '', description: '' });
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
          <span>{showAddForm ? 'Cancel' : 'Add Department'}</span>
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showAddForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">{editingId ? 'Edit Department' : 'Add New Department'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Department Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newDepartment.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter department name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={newDepartment.description}
                    onChange={handleInputChange}
                    placeholder="Enter department description"
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
                  disabled={!newDepartment.name}
                >
                  {editingId ? 'Update Department' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {departments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-building fs-1 text-muted mb-3"></i>
              <p className="text-muted">No departments found. Add your first department to get started.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Department</th>
                    <th>Description</th>
                    <th>Employees</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id}>
                      <td>{dept.id}</td>
                      <td>
                        <div className="fw-bold">{dept.name}</div>
                      </td>
                      <td>{dept.description || '-'}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {dept._count?.employees || 0}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Edit"
                            onClick={() => handleEditDepartment(dept)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDeleteDepartment(dept.id)}
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
