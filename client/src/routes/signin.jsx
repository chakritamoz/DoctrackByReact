import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin } from '../functions/auth';

const SignIn = () => {
  const [inputs, setInputs] = useState({});

  const navigate = useNavigate();

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    signin(inputs)
      .then((res) => {
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <>
      <h2>SIGN-IN</h2>
      <form onSubmit={handleSubmit}>
        <label>Username:
          <input
            type='text'
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
          />
        </label><br/>
        <label>Password:
          <input
            type='password'
            name='password'
            value={inputs.password || ""}
            onChange={handleChange}
          />
        </label><br/>
        <input type='submit' value='Sign In'/>
      </form>
      <div>
        <p>You don't have an account yet? <Link to="/register">Register</Link></p>
      </div>
    </>

  )
}

export default SignIn;