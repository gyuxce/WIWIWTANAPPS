export const handleDownloadClick = (url, filename = 'Lampiran.pdf') => {
  var link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
