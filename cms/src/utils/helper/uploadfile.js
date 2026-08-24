import { openNotification } from 'components/custom/NotificationComponent';
import { Notification, toast } from 'components/ui';
import dayjs from 'dayjs';
import { apiFile } from 'services/ApiBase';

// Flattens transparent PNG/GIF/WebP images onto a white background before upload.
// Sardine (the storage microservice) flattens transparency to black when it
// resizes images server-side, so we pre-flatten to white on the client instead.
const flattenTransparentImage = (file) => {
  if (!['image/png', 'image/gif', 'image/webp'].includes(file.type)) {
    return Promise.resolve(file);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(file);
          return;
        }
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.92);
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

export const uploadFile = async (selectedFile) => {
  try {
    const fileToUpload = await flattenTransparentImage(selectedFile);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    const ress = await apiFile(formData);
    return ress;
  } catch (error) {
    openNotification('Error', 'danger', 'Error saving data: ' + error?.response?.data?.message || error?.message);
    return null;
  }
};

export const exportData = async (type, apiExport, fileName, params = {}) => {
  try {
    const result = await apiExport(params);
    if (result && result?.status === 200) {
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (error) {
    toast.push(
      <Notification type="danger" title="Error">
        {error?.response?.data?.message || error?.message || 'Failed to export'}
      </Notification>,
      {
        placement: 'top-center',
      },
    );
  }
};
