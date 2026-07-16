const initialParam = {
  q: null,
  limit: 10,
  page: 1,
  type: 'pagination',
  relations: 'user.role,topic,user.profilePicture',
  sort_by: 'desc',
  order_by: 'created_at',
};
export default initialParam;
