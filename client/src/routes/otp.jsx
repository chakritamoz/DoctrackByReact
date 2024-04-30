import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOTP } from '../functions/auth';

const OTP = () => {
  const [inputs, setInputs] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.username) {
      setInputs((prevInputs) => ({...prevInputs, username: location.state.username}));
    }
  }, [location.state]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    verifyOTP(inputs)
      .then((res) => {
        console.log(res);
        navigate('/');
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <h2>OTP</h2>
      <form onSubmit={handleSubmit}>
        <input type='hidden' name='username' value={inputs.username}/>
        <label>OTP:
          <input
            type='text'
            name='otpCode'
            vlaue={inputs.otp || ""}
            onChange={handleChange}
          />
        </label>
        <input type='submit' value='Submit'/>
      </form>
    </>
  )
}

export default OTP