import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/context';

export default function EmployeeDashboard() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const employee = state.user; // Assuming user data is stored in state.user

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="dashboard-container" style={{
      display: 'flex',
      minHeight: 'calc(100vh - 80px)',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        backgroundColor: '#fff',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="px-3 mb-4">
          <h4 className="text-center" style={{ color: '#1976D2' }}>My Dashboard</h4>
          <p className="text-muted small text-center mb-2">Welcome back, {employee?.username || 'Employee'}</p>
          <p className="text-muted small text-center">{employee?.department || 'Employee'}</p>
        </div>

        <nav className="nav flex-column flex-grow-1 px-3">
          <Link
            to="/employee/dashboard/profile"
            className="nav-link py-3"
            style={{
              borderLeft: '4px solid transparent',
              color: '#1976D2',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              borderRadius: '0 8px 8px 0',
              margin: '4px 0'
            }}
            activeStyle={{
              borderLeft: '4px solid #2196F3',
              backgroundColor: '#E3F2FD',
              color: '#0D47A1',
              fontWeight: '600'
            }}
          >
            <i className="bi bi-person me-2"></i> My Profile
          </Link>

         
         
        </nav>

        <div className="px-3 mt-auto">
          <button
            onClick={handleLogout}
            className="btn btn-outline-primary w-100"
            style={{
              borderRadius: '8px',
              padding: '8px',
              fontWeight: '500',
              borderColor: '#1976D2',
              color: '#1976D2'
            }}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '20px',
        backgroundColor: '#f8f9fa',
        overflowY: 'auto'
      }}>
        <Outlet />
      </div>
    </div>
  );
}
