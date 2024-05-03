import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { getAccounts } from '../functions/account';

const Accounts = () => {
  const [accounts, setAccounts] = useState({});

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    getAccounts()
      .then((res) => setAccounts(res.data))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div>Accounts</div>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>CreateAt</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          { 
            accounts ? accounts.map((acc, idx) => 
              <tr key={idx}>
                <td>{acc.username}</td>
                <td>{acc.createAt}</td>
                <td>
                  <Link to=''>Approve</Link>
                </td>
              </tr>
            ) : null
          }
        </tbody>
      </table>
    </>
  )
}

export default Accounts