import { MagnifyingGlassIcon, MixerHorizontalIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import { AdaptableCard, CardItemForumMyPost } from 'components/shared';
import { Button, Checkbox, Input, Notification, Pagination, Select, toast } from 'components/ui';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useForum from 'utils/hooks/useForum';
import initialParam from '../constant/initialParam';
import { filterForumConstant, pageConstant } from 'components/ui/utils/constant';
import SideBar from 'components/template/SideFilter';
import { AccordionCustome, AccordionItemCustome } from 'components/ui/AccordionCustome/AccordionCustome';
import { ViewNodata } from 'components/custom';

const Page = () => {
  const { getListForumMyPost, forumMyPostList, metaForumMyPostList, getTopicsForum, forumTopicsList } = useForum();
  const navigate = useNavigate();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [checkboxListTopik, setCheckboxListTopik] = useState([]);
  const [checkboxSorting, setCheckboxSorting] = useState();
  const [filterTopik, setFilterTopik] = useState([]);
  const [params, setParams] = useState(initialParam);

  const pagePerOptions = pageConstant;

  const filterLihatBerdasarkan = filterForumConstant;

  const openNotification = (title, type, value) => {
    toast.push(
      <Notification title={title} type={type}>
        {value}
      </Notification>,
    );
  };

  const loadData = async () => {
    try {
      await getListForumMyPost(params);
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
    // setFirstLoad(false);
  };

  const loadTopics = async () => {
    try {
      await getTopicsForum({
        q: null,
        type: 'collection',
      });
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
    // setFirstLoad(false);
  };

  useEffect(() => {
    loadData();
    loadTopics();
    if (forumTopicsList) {
      const parsedTopics = forumTopicsList.map((v) => {
        return {
          value: v.name,
          label: v.name,
        };
      });
      setFilterTopik(parsedTopics);
    }
  }, [params]);

  const handleCheckboxChange = (value) => {
    if (checkboxListTopik.includes(value)) {
      setCheckboxListTopik(checkboxListTopik.filter((item) => item !== value));
    } else {
      setCheckboxListTopik([...checkboxListTopik, value]);
    }
  };
  const submitFilter = () => {
    let options = [];
    let sort_by = 'desc';
    let order_by = 'created_at';
    if (checkboxListTopik.length > 0) {
      options.push(`filter,topic.name,in,${checkboxListTopik.join('|').trim()}`);
    }
    if (checkboxSorting) {
      const splitCheckbox = checkboxSorting.split(',');
      sort_by = splitCheckbox[1];
      order_by = splitCheckbox[0];
    }

    setParams({
      ...params,
      sort_by: sort_by,
      order_by: order_by,
      options: options,
    });
    setToggleDrawer(false);
  };

  const onCheckSorting = (val) => {
    setCheckboxSorting(val);
  };

  return (
    <div>
      <AdaptableCard className="rounded-2xl border-none" bodyClass="p-6">
        <p className="text-h3 font-opificio text-second-200 mb-6">Postingan Saya</p>
        <div className="mb-6 flex justify-between">
          <div className="flex">
            <Input
              className={`w-[250px] h-[40px]`}
              placeholder="Cari judul diskusi..."
              suffix={<MagnifyingGlassIcon height={20} width={20} className="text-black" />}
              onChange={debounce((e) => setParams({ ...params, q: e.target.value }), 1000)}
            />
            <Button
              className={`w-[200px] h-[40px] !px-[12px] ml-3 text-second-100 border-gray-300`}
              variant="plain"
              onClick={() => {
                setToggleDrawer((prev) => !prev);
              }}
            >
              <div className="flex flex-row justify-between">
                <div className="flex flex-row gap-1 items-center">
                  <div>
                    <MixerHorizontalIcon style={{ height: '16px', width: '16px' }} />
                  </div>
                  <div className="text-[12px]">Filter</div>
                </div>
                {checkboxListTopik.length > 0 || checkboxSorting ? (
                  <div className="h-auto w-5 bg-main-200 rounded flex justify-center items-center">
                    <p className="text-sub-b text-white -mb-[2px] text-[12px]">
                      {checkboxListTopik.length + (checkboxSorting ? 1 : 0)}
                    </p>
                  </div>
                ) : null}
              </div>
            </Button>
          </div>
          <Button
            isAction
            icon={<PlusCircledIcon height={24} width={24} />}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate('/forum/post');
            }}
            className="bg-white !px-3 !py-2 flex items-center !rounded-lg"
          >
            <div className="mt-1 ml-1 !font-goth text-black  !font-normal text-xs">Buat Post Baru</div>
          </Button>
        </div>
        {forumMyPostList?.length > 0 ? (
          forumMyPostList?.map((val, i) => (
            <CardItemForumMyPost
              key={i.toString()}
              data={val}
              onLoad={loadData}
              onClick={() => {
                navigate(`/forum/detail/${val.id}`);
              }}
            />
          ))
        ) : (
          <ViewNodata />
        )}
        <div className="mt-6 flex justify-between">
          <div className="flex">
            <Pagination
              total={metaForumMyPostList?.last_page}
              currentPage={metaForumMyPostList?.currentPage}
              onChange={(page) => setParams({ ...params, page: page })}
            />
          </div>
          <Select
            placeholder="10 / page"
            styleControl={{ width: '200px' }}
            options={pagePerOptions}
            onChange={(e, page) => setParams({ ...params, limit: e.value, page: page })}
            menuPlacement="auto"
          ></Select>
        </div>
      </AdaptableCard>
      <SideBar
        closePanel={() => {
          setToggleDrawer(false);
        }}
        panelExpand={toggleDrawer}
        className="w-[520px]"
      >
        <div className="h-[85%] 2xl:h-[88%] overflow-auto">
          <AccordionCustome>
            <AccordionItemCustome title="Topik Diskusi">
              <div className="mt-3 py-3 px-4">
                {filterTopik?.map((val, idx) => {
                  const isChecked = checkboxListTopik.includes(val.value);
                  return (
                    <div key={idx}>
                      <Checkbox
                        className={`text-center text-black text-sm font-normal font-goth leading-[21px] ${
                          idx != filterTopik.length - 1 ? ' mb-5' : ''
                        }`}
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(val.value)}
                      >
                        <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                          {val.label}
                        </span>
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </AccordionItemCustome>
          </AccordionCustome>
          <div className="h-4"></div>
          <AccordionCustome>
            <AccordionItemCustome title="List Berdasarkan">
              <div className="mt-3 py-3 px-4">
                {filterLihatBerdasarkan.map((val, idx) => {
                  return (
                    <div key={idx}>
                      <Checkbox
                        // className="checkbox text-main-200"
                        type="checkbox"
                        className={`${idx != filterLihatBerdasarkan.length - 1 ? ' mb-5' : ''}`}
                        checked={val.value === checkboxSorting}
                        onChange={() => onCheckSorting(val.value)}
                      >
                        <span className="text-center text-black text-sm font-normal font-goth leading-[21px]">
                          {val.label}
                        </span>
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </AccordionItemCustome>
          </AccordionCustome>
        </div>
        <div className="">
          <div className="flex items-center justify-center border-t border-stone-200 space-x-3 pt-6 pb-8">
            <Button
              variant="default"
              className="!py-0 w-[200px] h-10 "
              icon={<img src="/img/icon/refresh-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
              onClick={() => {
                setCheckboxListTopik([]);
                setCheckboxSorting('');
              }}
            >
              <div className="text-black font-normal">Atur Ulang</div>
            </Button>
            <Button
              variant="default"
              className="!py-0 w-[200px] h-10"
              icon={<img src="/img/icon/checklist-icon.svg" alt="" style={{ height: '24px', width: '24px' }} />}
              onClick={submitFilter}
            >
              <div className="text-black font-normal">Konfirmasi</div>
            </Button>
          </div>
        </div>
      </SideBar>
    </div>
  );
};

export default Page;
