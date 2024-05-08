import axios from 'axios';
import { createHeaders } from './createHeaders';

export const register = async (user) => {
  return await axios.post(process.env.REACT_APP_API + '/register', user);
}

export const signin = async (user) => {
  return await axios.post(process.env.REACT_APP_API + '/signin', user);
}

export const verifyOTP = async (user) => {
  return await axios.put(process.env.REACT_APP_API + '/verifyOTP', user);
}

export const verifyAdmin = async (id) => {
  const headers = createHeaders();
  return await axios.put(process.env.REACT_APP_API + '/verifyAdmin/' + id, {}, { headers });
}