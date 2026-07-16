export type QueryType = {
  type: "pagination" | "collection";
  options?: any[];
  q?: string;
  page?: number;
  limit?: number;
  order_by?: string;
  sort_by?: string | "desc" | "asc";
  relations?: string[];
  started_at?: string;
  finished_at?: string;

  //additional
  post_id?: string;
  parent_id?: string;
  category_id?: string;
  type_post?: "populer" | "trending";
};
