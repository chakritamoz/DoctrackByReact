import axios from 'axios';

export const register = async (user) => {
  return await axios.post(process.env.REACT_APP_API + '/register', user);
}

export const signin = async (user) => {
  return await axios.post(process.env.REACT_APP_API + '/signin', user, {
    withCredentials: true
  });
}

export const verifyOTP = async (user) => {
  return await axios.put(process.env.REACT_APP_API + '/verifyOTP', user);
}

export const verifyAdmin = async (id) => {
  return await axios.put(process.env.REACT_APP_API + '/verifyAdmin/' + id, {}, {
    withCredentials: true
  });
}