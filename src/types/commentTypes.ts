export interface IComment {
  id: number;
  username: string;
  email: string;
  home_page: string | null;
  text: string;
  created_at: string;
}

export interface ICommentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IComment[];
}

export interface IFormErrors {
  username?: string;
  email?: string;
  home_page?: string;
  text?: string;
  captcha_text?: string;
  image?: string;
  file?: string;
}

export interface ICommentFormProps {
  parentId?: number;
  fetchComments: () => void;
  onSuccess?: () => void;
  socket?: WebSocket | null;
}

export interface IFormData {
  username: string;
  email: string;
  home_page?: string;
  text: string;
  captcha_text: string;
  image?: Blob | null;
  file?: Blob | null;
}

export interface ICommentDetail {
  id: number;
  username: string;
  email: string;
  home_page: string | null;
  text: string;
  created_at: string;
  replies: ICommentDetail[];
}