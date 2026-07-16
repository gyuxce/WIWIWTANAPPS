import { openNotification } from 'components/custom/NotificationComponent';
import { Notification, toast } from 'components/ui';
import dayjs from 'dayjs';
import { apiFile } from 'services/ApiBase';

export const uploadFile = async (selectedFile) => {
  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
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
