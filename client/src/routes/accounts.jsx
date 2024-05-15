import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAccounts, removeAccount } from '../functions/account';
import { verifyAdmin } from '../functions/auth';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadAccounts();
  }, []);

  // Load accounts data
  const loadAccounts = async () => {
    getAccounts()
      .then((res) => {
        setAccounts(res.data)
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        navigate('/signin');
      });
  }

  // Approve account
  const approveAccount = async(id) => {
    verifyAdmin(id)
      .then((res) => {
        console.log('Approve success!');
      })
      .catch((err) => console.log(err));
  }
  
  // Delete remove
  const deleteAccount = async(id) => {
    removeAccount(id)
      .then((res) => {
        console.log('remove success!');
        loadAccounts();
      })
      .catch((err) => console.log(err));
  }

  if (loading) {
    return <div>Loading...</div>
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
                  <button onClick={() => approveAccount(acc._id)}>Approve</button>
                  <button onClick={() => deleteAccount(acc._id)}>Remove</button>
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