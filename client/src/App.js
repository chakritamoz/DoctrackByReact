import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    // Fetch data from the server
    await axios.get('http://localhost:8080/api/account')
      .then(res => setUsers(res.data))
      .catch(err => console.log('error fetching data:', err));
  }

  return (
    <div className='App'>
      <h1>React App</h1>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>username</th>
            <th>email</th>
            <th>create date</th>
            <th>update date</th>
          </tr>
        </thead>
        <tbody>
          {
            users ? users.map((item, idx) => 
              <tr key={ idx }>
                <td>{ item._id }</td>
                <td>{ item.username }</td>
                <td>{ item.email }</td>
                <td>{ item.createdAt }</td>
                <td>{ item.updatedAt }</td>
              </tr>
            ) : null
          }
        </tbody>
      </table>
    </div>
  );
}

export default App;
