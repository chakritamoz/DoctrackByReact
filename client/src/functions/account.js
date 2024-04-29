import axios from 'axios';

export const getAccounts = async () => {
  return await axios.get('http://localhost:8080/api/account');
}

export const removeAccount = async (id) => {
  return await axios.delete('http://localhost:8080/api/account/', id);
}