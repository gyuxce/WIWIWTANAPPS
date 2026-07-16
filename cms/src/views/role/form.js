import React, { useEffect, useMemo, useState } from 'react';
import Card from 'components/ui/Card';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { apiShow, apiStore, apiUpdate } from './api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Button, toast, Notification, FormContainer, FormItem, Input, Select } from 'components/ui';
import { PageConfig } from './config';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { apiGetMenu } from 'services/AppService';
import { OPTION_STATUS_MASTER_DATA } from 'components/ui/utils/constant';
import { getValueByKey } from 'components/ui/utils/getValueByKey';
import { DataTable } from 'components/shared';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import { setAuthority } from 'store/auth/userSlice';
import { useDispatch } from 'react-redux';
import { apiUserMe } from 'services/AuthService';
dayjs.extend(utc);

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Wajib diisi'),
});

const FormData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState({});
  const [menu, setMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  const [checkboxList, setCheckboxList] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: PageConfig.moduleTitle, path: PageConfig.url },
    { label: id ? PageConfig.editTitle : PageConfig.createTitle, path: '' },
  ];

  const columns = useMemo(() => {
    const cols = [];

    for (let index = 0; index < PageConfig.listMenus.length; index++) {
      const el = PageConfig.listMenus[index];
      if (checkboxList.includes(el.key)) {
        cols.push({
          Header: el.label,
          accessor: el.key,
          sortable: el.sortable,
          width: el.width,
          Cell: (props) => {
            const row = props.row.original;
            return <span className="text-xs">{getValueByKey(row, el.key)}</span>;
          },
        });
      }
    }

    return cols;
  }, [checkboxList, selectedMenu]);

  const getMenu = async () => {
    setLoading(true);
    try {
      const ress = await apiGetMenu({ type: 'collection' });
      setMenu(ress.data?.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.push(
        <Notification title={'Error'} type="danger">
          {error?.response?.data?.message || error?.message || 'Something went wrong on fetch data menu'}
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    }
  };

  const getData = async () => {
    try {
      const params = { relations: ['roleMenus.menu'].join() };
      const ress = await apiShow(id, params);
      const dt = ress?.data?.data;
      const selectedIds = dt?.menus?.map((val) => ({ menu_id: val?.menu?.id })) || [];

      setDetail(dt);
      setSelectedMenu(selectedIds);
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

  const updateUserPermissions = async () => {
    try {
      const ress = await apiUserMe({
        relations: ['role.roleMenus.menu'].join(),
      });

      if (ress?.data?.data) {
        const permissionsSlugs = ress?.data?.data?.role?.menus?.map((item) => item?.menu?.slug) || [];
        dispatch(setAuthority(permissionsSlugs));
      }
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

  const onSubmit = async (body) => {
    try {
      let title = 'membuat';
      const params = { ...body, role_menu: selectedMenu };
      if (id) {
        title = 'memperbarui';
        await apiUpdate(id, params);
      } else {
        await apiStore(params);
      }
      await updateUserPermissions();
      toast.push(
        <Notification title="Sukses" type="success">
          Berhasil {title} data
        </Notification>,
        {
          placement: 'top-center',
        },
      );
      navigate(PageConfig.url);
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

  const onAllRowSelect = (checked, rows) => {
    const selectedIds = checked ? rows.map((row) => ({ menu_id: row.original[PageConfig.primaryKey] })) : [];
    setSelectedMenu(selectedIds);
  };

  const onCheckBoxChange = (checked, row) => {
    const menuId = row[PageConfig.primaryKey];
    setSelectedMenu((prevSelectedMenu) => {
      if (checked) {
        return [...prevSelectedMenu, { menu_id: menuId }];
      } else {
        return prevSelectedMenu.filter((item) => item.menu_id !== menuId);
      }
    });
  };

  useEffect(() => {
    getMenu();
    if (id) {
      getData();
    }
  }, [id]);

  useEffect(() => {
    let x = [];
    for (let index = 0; index < PageConfig.listMenus.length; index++) {
      const el = PageConfig.listMenus[index];
      if (el.is_show) {
        x.push(el.key);
      }
    }
    setCheckboxList(x);
  }, []);

  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to={PageConfig.url}>
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">
            {id ? PageConfig.editTitle : PageConfig.createTitle}
          </div>
        </div>
      </div>
      <Card bodyClass="!p-6" className="border-none rounded-xl">
        <Formik
          initialValues={{
            name: detail?.name || '',
            status: !id ? 1 : detail?.status,
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await onSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ values, touched, errors, setFieldValue, isSubmitting }) => {
            return (
              <Form>
                <div className="text-black text-xl font-normal font-opificio mb-4 flex justify-between items-center">
                  <span>Form Setting Hak Akses</span>
                  <div>
                    <Button type="submit" loading={isSubmitting} disabled={isSubmitting} className="w-[200px] h-12 p-3">
                      <div className="text-blue-950 text-sm font-normal font-goth">Konfirmasi</div>
                    </Button>
                  </div>
                </div>
                <FormContainer className="text-sm">
                  <div className="grid grid-cols-2 gap-5">
                    <FormItem invalid={errors.name && touched.name} errorMessage={errors.name}>
                      <Field name="name">
                        {({ field }) => (
                          <div>
                            <p className="text-black leading-[21px] mb-2">
                              Nama Role <span className="text-red-600">*</span>
                            </p>
                            <Input
                              value={values?.name}
                              size="md"
                              placeholder="Masukan nama role"
                              onChange={(e) => setFieldValue(field.name, e.target.value)}
                            />
                          </div>
                        )}
                      </Field>
                    </FormItem>
                    <FormItem invalid={errors.status && touched.status} errorMessage={errors.status}>
                      <Field name="status">
                        {({ field, form }) => {
                          return (
                            <div>
                              <p className="text-black leading-[21px] mb-2">
                                Status <span className="text-red-600">*</span>
                              </p>

                              <Select
                                size="md"
                                options={OPTION_STATUS_MASTER_DATA}
                                onChange={(option) => {
                                  form.setFieldValue(field.name, option.value);
                                }}
                                value={OPTION_STATUS_MASTER_DATA.find((v) => v.value === values.status)}
                                isDisabled={!id}
                                placeholder="Select Status"
                              />
                            </div>
                          );
                        }}
                      </Field>
                    </FormItem>
                  </div>
                  {!loading && (
                    <DataTable
                      selectedIds={selectedMenu}
                      columns={columns}
                      data={menu}
                      loading={loading}
                      selectable={true}
                      wrapClass="min-h-[360px]"
                      onCheckBoxChange={onCheckBoxChange}
                      onIndeterminateCheckBoxChange={onAllRowSelect}
                      showPagination={false}
                    />
                  )}
                </FormContainer>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </div>
  );
};

export default FormData;
