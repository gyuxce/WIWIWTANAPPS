import { Input, Notification, Spinner, toast } from 'components/ui';
import React, { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import useForum from 'utils/hooks/useForum';

const DirtyWordList = () => {
  const [word, setWord] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const { hashWordsList, getListHashWords, postHashWords, deleteHashWords } = useForum();

  const removeData = async (id) => {
    try {
      await deleteHashWords(id);
      openNotification('Berhasil', 'success', 'Berhasil Hapus data');
      loadData();
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
  };

  const addDummyData = async (value) => {
    if (value) {
      var bodyData = {
        name: value,
      };
      try {
        await postHashWords(bodyData);
        openNotification('Berhasil', 'success', 'Berhasil menambahkan data');
        setWord('');
        loadData();
      } catch (error) {
        openNotification('Error', 'danger', error?.message);
      }
    } else {
      openNotification('Pemberitahuan', 'warning', 'Isi terlebih dahulu');
    }
  };

  const openNotification = (title, type, value) => {
    toast.push(
      <Notification title={title} type={type}>
        {value}
      </Notification>,
    );
  };

  const Datalist = ({ value }) => {
    const [rmLoading, setRmLoading] = useState(false);
    return (
      <div className="border-[1px] border-grey-300 rounded-md py-2 px-3 flex gap-2">
        <div className="font-semibold">{value?.name}</div>
        <div
          className="cursor-pointer"
          onClick={() => {
            setRmLoading(true);
            removeData(value.id);
          }}
        >
          {!rmLoading ? (
            <CgClose className="text-grey-300" size={20} />
          ) : (
            <Spinner className="text-grey-300" size={20} />
          )}
        </div>
      </div>
    );
  };

  const loadData = async () => {
    try {
      await getListHashWords({
        type: 'collection',
      });
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
    setFirstLoad(false);
  };

  useEffect(() => {
    if (firstLoad) {
      loadData();
    }
  }, [firstLoad]);

  return (
    <div className="flex flex-col gap-5 bg-white p-5 rounded-2xl text-black">
      <div className="text-xl text-main-200 font-opificio">Daftar Kata Terlarang</div>
      <div className="flex flex-col gap-2">
        <p>
          Tambah Kata Terlarang <span className="text-red-300">*</span>
        </p>
        <div className="flex gap-5">
          <Input size="md" placeholder="Input kata terlarang" value={word} onChange={(e) => setWord(e.target.value)} />
          <button
            className="border-[1px] border-black px-3 rounded-lg h-10 whitespace-nowrap shadow-custom hover:shadow-sm"
            onClick={() => addDummyData(word)}
          >
            Tambahkan ke List
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>List Kata Terlarang</p>
        <div className="border-[1px] border-grey-300 rounded-md p-3 flex flex-wrap gap-2 min-h-[65px]">
          {hashWordsList?.map((val, i) => (
            <Datalist key={i} value={val} index={i} />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        {/* <button
          className="border-[1px] border-black px-3 rounded-lg  !h-12 !min-w-[12.5rem] whitespace-nowrap shadow-custom hover:shadow-sm text-main-200"
          onClick={() => console.log('testing')}
        >
          Konfirmasi
        </button> */}
      </div>
    </div>
  );
};

export default DirtyWordList;
