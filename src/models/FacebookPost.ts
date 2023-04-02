export interface FacebookPost {
  id: string;
  from: {
    id: string;
    name: string;
  };
  message: string;
  created_time: string;
  likes: {
    data: {
      id: string;
      name: string;
    }[];
    summary: {
      total_count: number;
    };
  };
  comments: {
    data: {
      id: string;
      from: {
        id: string;
        name: string;
      };
      message: string;
      created_time: string;
    }[];
    summary: {
      total_count: number;
    };
  };
  images: string[];
}

export interface FacebookResponse<T> {
  data: T[];
  paging?: {
    previous?: string;
    next?: string;
  };
}
