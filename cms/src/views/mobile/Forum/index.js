import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MobileForum = () => {
  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    const url = `wiwitan://mobile/forum/${id}`;
    window.location.replace(url);
  }, []);
  return (
    <div className="flex flex-col bg-white p-5 rounded">
      <p>Redirect</p>
    </div>
  );
};

export default MobileForum;
