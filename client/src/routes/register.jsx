import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { register } from '../functions/auth';

const Register = () => {
  const [inputs, setInputs] = useState([]);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));

    // Validate check to ensure password and confirmPassword match
    if (name === "confirmPassword" && inputs.password !== inputs.confirmPassword) {
      setPasswordMatch(false);
      return; // Prevent furthre execution if passwords don't match
    } else if (inputs.password === inputs.confirmPassword) {
      setPasswordMatch(true);
      return;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    register(inputs)
      .then((res) => {
        navigate('/otp', {
          state: {
            username: inputs.username
          }
        })
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:
          <input
            type='text'
            name='username'
            value={inputs.username || ""}
            onChange={handleChange}
            placeholder='username'
          />
        </label><br/>
        <label>Password:
          <input
            type='password'
            name='password'
            value={inputs.password || ""}
            onChange={handleChange}
            placeholder='password'
          />
        </label><br/>
        <label>Confirm password:
          <input
            type='password'
            name='confirmPassword'
            value={inputs.confirmPassword || ""}
            onChange={handleChange}
            placeholder='confirm paassword'
          />
        </label>
        {!passwordMatch && <p style={{ color: 'red' }}>Password don't match</p>}
        <br/>
        <label>Email:
          <input
            type='email'
            name='email'
            value={inputs.email || ""}
            onChange={handleChange}
            placeholder='email'
          />
        </label><br/>
        <input type='submit' value='Register'/>
        <button type='button' onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </>
  )
}

export default Register