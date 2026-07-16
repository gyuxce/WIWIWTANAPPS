import React, { useEffect, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams } from 'react-router-dom';
import { apiShow } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toast, Notification } from 'components/ui';
import { PageConfig } from './config';
import Breadcrumbs from 'components/ui/Breadcrumbs';
dayjs.extend(utc);

const FormData = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState({});
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: `Form ${PageConfig.pageTitle}`, path: '' },
  ];

  const getData = async () => {
    try {
      const ress = await apiShow(id);
      setDetail(ress?.data?.data);
    } catch (error) {
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{detail?.name}</div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl"></Card>
    </div>
  );
};

export default FormData;
