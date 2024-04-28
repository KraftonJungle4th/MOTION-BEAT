import React, { useState, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckLoginValidate } from "../utils/checkValidate";

const Login = () => {
  /* ID PW */
  const emailRef = useRef(null);
  const nicknameRef = useRef(null);
  const pwRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* Navi */
  const navigate = useNavigate();

  const backendUrl = process.env.REACT_APP_API_URL

  /*  */
  const handleSubmit = async (event) => {
    event.preventDefault();
    // if (!email || !pw) {
    //     alert('이메일과 비밀번호를 모두 입력해주세요.');
    //     return;
    // }
    setIsLoading(true);

    /* input 값 추출 */
    const formData = {
      email: emailRef.current.value,
      nickname: nicknameRef.current.value,
      pw: pwRef.current.value,
    };

    /* 값 유효성 검사 */
    const validationErrors = await CheckLoginValidate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      console.log(validationErrors)
      console.log(errors)
      return
    }

    try {
      console.log(backendUrl)
      const response = await axios.post(`${backendUrl}/api/users/signup`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      localStorage.setItem('userToken', response.data.token); // 로그인 성공 시 토큰 저장
      localStorage.setItem('userId', response.data.userId); // 사용자 ID 저장
      alert('로그인에 성공하였습니다.');
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || '없는 계정이거나 비밀번호가 틀렸습니다. 다시 시도해주세요.';
        alert(message);
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    }
  };

  const handleForgot = () => {
    navigate("/forgot");
  };
  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column"
      }}>
        <form onSubmit={handleSubmit}>
          <p>LOGIN</p>
          <div>
            <input type="text" placeholder="이메일" ref={emailRef} />
            {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
          </div >
          <div>
            <input type="text" placeholder="닉네임" ref={nicknameRef} />
            {errors.nickname && <p style={{ color: 'red' }}>{errors.nickname[0]}</p>}
          </div>
          <div>
            <input type="password" placeholder="비밀번호" ref={pwRef} />
            {errors.pw && <p style={{ color: 'red' }}>{errors.pw[0]}</p>}
          </div>
          <div>
            <button type="submit">Log in</button>
            <button onClick={handleForgot}>Forgot</button>
            <button onClick={handleSignup}>Signup</button>
          </div>
        </form>
        <div>
          <div>
            <button id="kakao-login-btn">Login with Kakao</button>
            <button id="google-login-btn">Login with Google</button>
          </div>
          {/* <div>
            <GoogleLoginButton>Login with Google</GoogleLoginButton>
            <KakaoLoginButton>Login With Kakao</KakaoLoginButton>
          </div> */}
        </div>
      </div>
    </>
  )
}
export default Login