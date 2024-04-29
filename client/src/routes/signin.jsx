import React, { useState } from 'react'

const SignIn = () => {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(inputs);
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
        <input type='submit'/>
      </form>
    </>

  )
}

export default SignIn