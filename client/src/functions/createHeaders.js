import cookies from 'js-cookie';

export const createHeaders = () => {
  // get token from cookie
  const token = cookies.get('jwttoken');

  // create headers and set token into authorizations
  const headers= {
    'Content-Type': 'application/json',
    'Authorizations': `Bearer ${token}`
  };

  return headers;
};