import { AdaptableCard } from 'components/shared';
import CommentDialog from 'components/shared/CommentDialog';
import { Avatar, Button, Dialog, Dropdown, Input, Notification, toast } from 'components/ui';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DetailOnPost from 'components/ui/DetailOnPost';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useForum from 'utils/hooks/useForum';
import CommentList from './CommentList';
import CloseSvg from 'assets/svg/CloseSvg';
import { apiDeleteForumPost } from 'services/ForumService';

const detailPost = () => {
  const { id } = useParams();
  const { getDetailForumPost, forumPostDetail } = useForum();
  const [content, setContent] = useState();
  const navigate = useNavigate();
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Daftar Postingan', path: '/forum' },
    { label: `${forumPostDetail?.title}`, path: '' },
    // Add more breadcrumb items as needed
  ];

  const [dialogIsOpen, setIsOpen] = useState(false);
  const [dialogCommentIsOpen, setIsOpenComment] = useState(false);

  const [deletedReason, setDeletedReason] = useState('');

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const openDialogComment = () => {
    setIsOpenComment(true);
  };

  const onDialogCloseComment = () => {
    setIsOpenComment(false);
  };

  const openNotification = (title, type, value) => {
    toast.push(
      <Notification title={title} type={type}>
        {value}
      </Notification>,
    );
  };

  const fetchDetailForum = async (postId) => {
    try {
      const params = {
        relations: 'user.role,topic,parentComment.child,parentComment.user,user.profilePicture',
      };
      const data = await getDetailForumPost(postId, params);
      const text = JSON.parse(JSON.parse(data?.data?.description));
      const converter = new QuillDeltaToHtmlConverter(text?.ops, {
        inlineStyles: true,
      });
      let convertedHtml = converter.convert();
      convertedHtml = convertedHtml
        .replace(/<ol>/g, '<ol class="list-decimal">')
        .replace(/<ul>/g, '<ul class="list-disc">');
      setContent(convertedHtml);
    } catch (error) {
      openNotification('Error', 'danger', error?.message);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetailForum(id);
    } else {
      navigate('/forum/');
    }
  }, [id, navigate]);

  const refreshComments = () => {
    if (id) {
      fetchDetailForum(id);
    }
  };

  const Toggle = (
    <Button variant="plain" className="flex justify-end w-full">
      ...
    </Button>
  );

  const editPost = (id) => {
    navigate('/forum/post/edit/' + id);
  };

  const deletePost = () => {
    openDialogDelete();
  };

  const openDialogDelete = () => {
    setIsOpen(true);
  };

  const onDialogDeleteOk = async (id, value) => {
    if (value) {
      var bodyData = {
        deleted_reason: value,
      };
      try {
        await apiDeleteForumPost(id, bodyData);
        setIsOpen(false);
        openNotification('Berhasil', 'success', 'Berhasil Hapus data');
        setDeletedReason('');
        navigate('/forum/');
      } catch (error) {
        openNotification('Error', 'danger', error?.message);
      }
    } else {
      openNotification('Pemberitahuan', 'warning', 'Isi terlebih dahulu');
    }
  };

  return (
    <div className="px-7">
      <div className="router mb-7">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex justify-start items-center">
          <Link to="/forum">
            <img src="/img/icon/previous.png" alt="" className="h-6 w-6" />
          </Link>
          <div className="text-blue-950 text-xl font-normal font-opificio">{forumPostDetail?.title}</div>
        </div>
      </div>
      <AdaptableCard className="rounded-2xl border-none" bodyClass="p-6">
        <div className="flex flex-row justify-between">
          <div className="flex items-center mb-3">
            <Avatar src={forumPostDetail?.user?.profilePicture?.url} shape="circle" size={34} />
            <p className="text-sub-b ml-2">
              {forumPostDetail?.user.name}{' '}
              {forumPostDetail?.user?.role?.name ? `[${forumPostDetail?.user?.role?.name}]` : ''}
            </p>
          </div>
          <Dropdown renderTitle={Toggle} placement={'bottom-end'}>
            <Dropdown.Item
              eventKey="a"
              onClick={() => editPost(forumPostDetail?.id)}
              className="text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit Postingan
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="b"
              onClick={() => deletePost()}
              className="text-sm text-gray-700 hover:bg-gray-100"
            >
              Hapus Postingan
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="flex flex-col">
          <div className="text-[28px] my-4">{forumPostDetail?.title}</div>
          <DetailOnPost
            countLike={forumPostDetail?.count_like}
            countComment={forumPostDetail?.count_comment}
            date={forumPostDetail?.created_at}
            topics={forumPostDetail?.topic?.name}
          />
        </div>
        {forumPostDetail && <div className="mt-5 px-5" dangerouslySetInnerHTML={{ __html: content }} />}
        <div className="flex flex-row justify-center items-center gap-4">
          {/* <Button variant="plain" className="border border-black" icon={<Link2Icon />}>
            Bagikan
          </Button> */}
          <div>
            <img src="/img/icon/like-button.png" alt="like-button" className="h-14 w-14" />
          </div>
        </div>
      </AdaptableCard>
      <AdaptableCard className="rounded-2xl border-none mt-6" bodyClass="p-6">
        <div className="flex">
          <div className="text-[28px] mb-5 text-black">Komentar</div>
          <div className="flex justify-center items-center w-8 h-8 bg-stone-100 rounded ml-3 mt-1">
            <div className="text-black font-bold font-goth">
              {forumPostDetail?.count_comment ? forumPostDetail?.count_comment : '0'}
            </div>
          </div>
        </div>

        <Button type="button" className="w-full bg-white !px-3 !py-2 flex items-center !rounded-lg">
          <div
            onClick={() => openDialogComment()}
            className="w-full mt-1 ml-1 !font-goth text-black !font-bold text-xs"
          >
            Tulis Komentar
          </div>
          <CommentDialog
            isOpen={dialogCommentIsOpen}
            onClose={onDialogCloseComment}
            postId={id}
            onCommentAdded={refreshComments}
          />
        </Button>

        {forumPostDetail?.parentComment?.map((val, i) => (
          <CommentList key={i.toString()} data={val} postId={id} onCommentAdded={refreshComments} />
        ))}
      </AdaptableCard>

      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
        width={600}
        height={578}
        closable={false}
        className={'relative'}
      >
        <div className="absolute top-4 right-4">
          <Button
            onClick={onDialogClose}
            variant="plain"
            size="xs"
            icon={
              <>
                <CloseSvg />
              </>
            }
          />
        </div>
        <div className="flex flex-col p-4">
          <div className="flex justify-center">
            <img src="/img/icon/trash.png" alt="trash" className="h-[64px] w-[64px]" />
          </div>
          <div className="flex flex-col">
            <p className="text-h3 font-opificio text-black text-center mt-10">Anda akan menghapus data ini</p>
            <div className="flex justify-center mt-4">
              <p className="text-caption-b-goth text-second-500 text-center">
                Data yang sudah dihapus tidak dapat dipulihkan. Klik "Kembali” untuk memastikan kembali.
              </p>{' '}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-caption-b-goth text-black mt-10">Alasan menghapus</p>
            <div className="flex justify-center mt-2 mb-2">
              <Input
                placeholder="Ketik isi notifikasi"
                value={deletedReason}
                onChange={(e) => setDeletedReason(e.target.value)}
                maxLength={200}
                textArea
              />
            </div>
            <p className="text-caption-b-goth text-black">*maksimal 200 karakter</p>
          </div>
          <div className="flex flex-col items-center justify-center mt-8">
            <div className="flex justify-center">
              <Button
                variant="default"
                className="!py-0 mr-2"
                style={{ height: '40px', width: '200px' }}
                onClick={onDialogClose}
              >
                <div className="text-black font-normal">Kembali</div>
              </Button>

              <Button
                variant="default"
                className="!py-0"
                style={{ height: '40px', width: '200px' }}
                onClick={() => onDialogDeleteOk(forumPostDetail.id, deletedReason)}
              >
                <div className="text-black font-normal">Hapus</div>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default detailPost;
