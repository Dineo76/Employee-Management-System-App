import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/context';

export default function Dashboard() {
  const { state, dispatch } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
    window.location.reload(); // Ensure a full page refresh to clear any state
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
          <h4 className="text-center" style={{ color: '#2E7D32' }}>EMS Dashboard</h4>
          <p className="text-muted small text-center mb-0">Welcome, {state.user?.username || 'User'}</p>
        </div>
        
        <nav className="nav flex-column flex-grow-1 px-3">
          <Link 
            to="/dashboard/employees" 
            className="nav-link py-3"
            style={{
              borderLeft: '4px solid transparent',
              color: '#2E7D32',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              borderRadius: '0 8px 8px 0',
              margin: '4px 0'
            }}
            activeStyle={{
              borderLeft: '4px solid #4CAF50',
              backgroundColor: '#E8F5E9',
              color: '#1B5E20',
              fontWeight: '600'
            }}
          >
            <i className="bi bi-people me-2"></i> Employees
          </Link>
          
          <Link 
            to="/dashboard/departments" 
            className="nav-link py-3"
            style={{
              borderLeft: '4px solid transparent',
              color: '#2E7D32',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              borderRadius: '0 8px 8px 0',
              margin: '4px 0'
            }}
            activeStyle={{
              borderLeft: '4px solid #4CAF50',
              backgroundColor: '#E8F5E9',
              color: '#1B5E20',
              fontWeight: '600'
            }}
          >
            <i className="bi bi-building me-2"></i> Departments
          </Link>
        </nav>
        
        <div className="px-3 mt-auto">
          <button 
            onClick={handleLogout}
            className="btn btn-outline-danger w-100"
            style={{
              borderRadius: '8px',
              padding: '8px',
              fontWeight: '500'
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
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
