import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login, logout, updateProfile } from '../store/authSlice';
import { User } from '../types';


const DEMO_CREDENTIALS = {
  username: 'demo@example.com',
  password: 'password123',
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const loginUser = async (username: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      const user: User = {
        username: 'Demo User',
        email: username,
      };
      const token = 'mock-jwt-token-' + Date.now();
      
      dispatch(login({ user, token }));
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updateUserProfile = (userData: User) => {
    dispatch(updateProfile(userData));
  };

  return {
    ...auth,
    loginUser,
    logoutUser,
    updateUserProfile,
  };
};