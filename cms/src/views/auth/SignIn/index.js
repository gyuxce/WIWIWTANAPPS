import React from 'react';
import SignInForm from './SignInForm';
// import { LogoSvg } from 'assets/svg'

const SignIn = () => {
  return (
    <>
      <div className="justify-left mb-10 font-sen">
        <p className="font-senBold mb-7 text-main-200 text-[28px]">Selamat Datang 👋</p>
        <p style={{ fontSize: 20, color: '#1F2937' }}>Silakan masuk untuk mengakses sistem admin Wiwitan.</p>
      </div>
      {/* <div className="mb-[2rem] text-start">
			</div> */}
      <SignInForm disableSubmit={false} />
    </>
  );
};

export default SignIn;
