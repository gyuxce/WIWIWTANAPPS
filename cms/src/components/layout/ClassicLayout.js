import React, { useEffect, useState } from 'react';
import SideNav from 'components/template/SideNav';
import View from 'views';
import Header from 'components/template/Header';
import { useDispatch } from 'react-redux';
import { setAuthority } from 'store/auth/userSlice';
import { apiUserMe } from 'services/AuthService';

const ClassicLayout = (props) => {
  const [user, setUser] = useState();
  const dispatch = useDispatch();

  const fetchDetail = async () => {
    try {
      const ress = await apiUserMe({
        relations: ['role.roleMenus.menu', 'profilePicture'].join(),
      });
      if (ress?.data?.data) {
        setUser(ress?.data?.data);
        const permissionsSlugs = ress?.data?.data?.role?.menus?.map((item) => item?.menu?.slug) || [];
        dispatch(setAuthority(permissionsSlugs));
      }
    } catch (error) {
      console.error('Error fetching user data:', error?.response?.data?.message);
    }
  };

  const HeaderActionsEnd = () => {
    return (
      <div className="justify-start items-center gap-2 inline-flex">
        <div className="w-[38px] h-[38px] relative">
          <div className="w-9 h-9 left-0 top-0 absolute bg-blue-950 rounded-full"></div>
          <img
            className="w-[34px] h-[34px] left-[1px] top-[1px] absolute rounded-full border border-white"
            src={user?.profilePicture?.url}
            alt=""
          />
        </div>
        <div className="flex-col justify-start items-start inline-flex font-normal font-goth">
          <div className="text-blue-950 text-sm leading-[21px]">{user?.name}</div>
          <div className="text-indigo-500 text-xs">{user?.role?.name ?? '-'}</div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  return (
    <div className="app-layout-classic flex flex-auto flex-col bg-gray-100 font-goth">
      <div className="flex flex-auto min-w-0 items-stretch h-[100vh]">
        <SideNav />
        <div className="flex flex-col flex-auto h-full min-w-0 relative w-full">
          <div className="flex flex-1">
            <div className="absolute left-0 right-0 bottom-0 top-0 overflow-auto">
              <Header className="flex flex-1 px-2 py-3" headerEnd={<HeaderActionsEnd />} />
              <View {...props} fetchMe={fetchDetail} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicLayout;
