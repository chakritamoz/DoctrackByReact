import axios from 'axios';

export const register = async (user) => {
  return await axios.post('http://localhost:8080/api/register', user);
}

export const signin = async (user) => {
  return await axios.post('http://localhost:8080/api/signin', user);
}
