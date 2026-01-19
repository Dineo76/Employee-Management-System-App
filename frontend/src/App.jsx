import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { useStore } from './store/context';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import Employees from './pages/dashboard/Employees';
import Departments from './pages/dashboard/Departments';

function Home() {
  return (
    <div style={{
      backgroundColor: '#E7F2E7',
      minHeight: 'calc(100vh - 200px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '50%',
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          backgroundColor: '#1a1a1a',
          borderRadius: '50%',
          width: '180px',
          height: '180px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4CAF50',
          fontWeight: 'bold',
          fontSize: '2.5rem',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div>NT</div>
          <div style={{
            fontSize: '1rem',
            marginTop: '0.5rem',
            color: '#4CAF50',
            fontWeight: 'normal',
            letterSpacing: '2px'
          }}>NEW TECH</div>
        </div>
      </div>

      <h1 className="mb-4" style={{
        color: '#2E7D32',
        marginTop: '2rem',
        fontWeight: 'bold'
      }}>Welcome to Employee Management System</h1>

      <p className="lead mb-5" style={{
        color: '2E7D32',
        maxWidth: '600px',
        lineHeight: '1.6',
        fontSize: '1.25rem'
      }}>
        WHERE WORK BECOMES SIMPLE,SMART AND ORGANISED       </p>

      <div className="d-flex justify-content-center gap-4" style={{
        marginTop: '2rem',
        flexWrap: 'wrap'
      }}>
        <Link
          to="/login"
          className="btn btn-primary btn-lg"
          style={{
            backgroundColor: '#4CAF50',
            border: 'none',
            padding: '0.75rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '50px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minWidth: '200px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
            }
          }}
        >
          Employee Login
        </Link>
        <Link
          to="/login"
          state={{ isAdmin: true }}
          className="btn btn-primary btn-lg"
          style={{
            backgroundColor: '#1B5E20',
            border: 'none',
            padding: '0.75rem 2.5rem',
            fontSize: '1.1rem',
            fontWeight: '600',
            borderRadius: '50px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minWidth: '200px',
            textAlign: 'center',
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
            }
          }}
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}

// Protected Route Wrapper with loading state and better auth handling
const PrivateRoute = ({ role = null }) => {
  const { state } = useStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // If we have a user in state, use that
      if (state.user) {
        setUserRole(state.user.role);
        setIsAuthenticated(true);
      } else {
        // Otherwise, try to decode the token to check if it's valid
        try {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          setUserRole(decoded.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
        }
      }
    }

    setIsLoading(false);
  }, [state.user]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // If role is specified and user doesn't have that role, redirect to appropriate dashboard
  if (role && userRole !== role) {
    return userRole === 'ADMIN'
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/employee/dashboard" replace />;
  }

  return <Outlet />;
};

export default function App() {
  const { state } = useStore();

  return (
    <Router>
      <Navbar />
      <main className="main-content" style={{ paddingTop: '20px', minHeight: 'calc(100vh - 76px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard Routes */}
          <Route element={<PrivateRoute role="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />}>
              <Route index element={
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <h2 className="mb-4" style={{ color: '#2E7D32' }}>Dashboard Overview</h2>
                      <div className="row">
                        <div className="col-md-4 mb-4">
                          <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="text-muted mb-2">Total Employees</h6>
                                  <h3 className="mb-0">5</h3>
                                </div>
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                                  <i className="bi bi-people-fill text-success fs-4"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="text-muted mb-2">Departments</h6>
                                  <h3 className="mb-0">3</h3>
                                </div>
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                                  <i className="bi bi-building text-primary fs-4"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-4">
                          <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="text-muted mb-2">Active Now</h6>
                                  <h3 className="mb-0">5</h3>
                                </div>
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                                  <i className="bi bi-activity text-warning fs-4"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title mb-4">Quick Actions</h5>
                          <div className="row g-3">
                            <div className="col-md-4">
                              <Link
                                to="/admin/dashboard/employees"
                                className="text-decoration-none"
                              >
                                <div className="card h-100 border-0 bg-light">
                                  <div className="card-body text-center">
                                    <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                      <i className="bi bi-person-plus-fill text-success fs-4"></i>
                                    </div>
                                    <h6 className="mb-0">Add New Employee</h6>
                                  </div>
                                </div>
                              </Link>
                            </div>
                            <div className="col-md-4">
                              <Link
                                to="/admin/dashboard/departments"
                                className="text-decoration-none"
                              >
                                <div className="card h-100 border-0 bg-light">
                                  <div className="card-body text-center">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                      <i className="bi bi-building-add text-primary fs-4"></i>
                                    </div>
                                    <h6 className="mb-0">Manage Departments</h6>
                                  </div>
                                </div>
                              </Link>
                            </div>
                            <div className="col-md-4">
                              <Link
                                to="/admin/dashboard/employees"
                                className="text-decoration-none"
                              >
                                <div className="card h-100 border-0 bg-light">
                                  <div className="card-body text-center">
                                    <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                                      <i className="bi bi-people-fill text-info fs-4"></i>
                                    </div>
                                    <h6 className="mb-0">View All Employees</h6>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="employees" element={<Employees />} />
              <Route path="departments" element={<Departments />} />
            </Route>
          </Route>

          {/* Employee Dashboard Routes */}
          <Route element={<PrivateRoute role="USER" />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />}>
              <Route index element={
                <div className="container">
                  <h2 className="mb-4" style={{ color: '#1976D2' }}>Welcome to Your Dashboard</h2>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">My Profile</h5>
                          <p className="card-text">View and update your personal information and preferences.</p>
                          <Link to="profile" className="btn btn-primary">Go to Profile</Link>
                        </div>
                      </div>
                    </div>
                    
                      </div>
                    </div>
                  
              } />
              <Route path="profile" element={<div>Employee Profile Page</div>} />
            </Route>
          </Route>

          {/* Redirect old dashboard URLs to appropriate dashboard based on role */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              {state.user?.role === 'ADMIN'
                ? <Navigate to="/admin/dashboard" replace />
                : <Navigate to="/employee/dashboard" replace />
              }
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}
