export type getCommentsType = {
  data: Data[];
  meta: Pagination;
};

export interface Data {
  id: string;
  comment: string;
  createdAt: string;
  taskId: string;
  authorId: string;
}

export interface Pagination {
  totalItem: number;
  currentPage: string;
  itemsPerPage: string;
  totalPages: number;
}
