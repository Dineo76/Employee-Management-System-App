import { loginStart, loginSuccess, loginFailure, logout } from '../slices/authSlice';
import api from '../../utils/api';

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Replace with your actual API endpoint
    const response = await api.post('/api/auth/login', credentials);
    
    dispatch(loginSuccess({
      user: response.data.user,
      token: response.data.token
    }));
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

export const logoutUser = () => (dispatch) => {
  // Clear any stored tokens
  localStorage.removeItem('token');
  dispatch(logout());
};

export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return dispatch(logout());
  }
  
  try {
    // Replace with your actual API endpoint to validate token
    const response = await api.get('/api/auth/me');
    
    dispatch(loginSuccess({
      user: response.data.user,
      token: token
    }));
    
    return { isAuthenticated: true };
  } catch (error) {
    localStorage.removeItem('token');
    dispatch(logout());
    return { isAuthenticated: false };
  }
};
