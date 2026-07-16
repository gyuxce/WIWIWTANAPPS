import React, { cloneElement } from 'react';
import { Container } from 'components/shared';
import { LogoMenuSvg } from 'assets/svg';

const Simple = ({ children, content, ...rest }) => {
  const today = new Date();
  const year = today.getFullYear();

  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1 gap-4 bg-white p-4 md:p-8">
      <div className="md:hidden w-full flex justify-center items-center mb-2">
        <LogoMenuSvg width={350} height={100} />
      </div>
      <Container className="flex flex-col justify-between items-center min-h-[500px] w-full md:w-2/3">
        <div className="flex-1 flex flex-col w-full px-4 md:mt-[100px]">
          {content}
          {children
            ? cloneElement(children, {
                contentClassName: 'text-center',
                ...rest,
              })
            : null}
        </div>
        <div className="py-4">
          <p className="text-[#94A3B8] text-sm md:text-base">© {year} WIWITAN ALL RIGHTS RESERVED</p>
        </div>
      </Container>
      <Container className="hidden md:flex flex-col flex-auto items-center justify-center">
        <img className="h-full" src="/img/others/login-art2.png" alt="login-art" />
      </Container>
    </div>
  );
};

export default Simple;
