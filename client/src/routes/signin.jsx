import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin } from '../functions/auth';
import cookies from 'js-cookie';

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
    signin(inputs)
      .then((res) => {
        cookies.set('jwttoken', res.data.token, { expires: 1 });
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
        <button><Link to="/">Cancel</Link></button>
      </form>
      <div>
        <p>You don't have an account yet? <Link to="/register">Register</Link></p>
      </div>
    </>

  )
}

export default SignIn;