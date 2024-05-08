import axios from 'axios';
import { createHeaders } from './createHeaders';

export const getAccounts = async () => {
  const headers = createHeaders();
  return await axios.get('http://localhost:8080/api/account', { headers });
}

export const removeAccount = async (id) => {
  return await axios.delete('http://localhost:8080/api/account/', id);
}