export interface Comment {
  id: number;
  username: string;
  email: string;
  home_page: string | null;
  text: string;
  created_at: string;
}

export interface CommentResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Comment[];
}


export interface FormErrors {
  username?: string;
  email?: string;
  home_page?: string;
  text?: string;
  captcha_text?: string;
  image?: string;
  file?: string;
}

export interface CommentFormProps {
  parentId?: number;
  fetchComments: () => void;
  onSuccess?: () => void;
}

export interface FormData {
  username: string;
  email: string;
  home_page?: string;
  text: string;
  captcha_text: string;
  image?: Blob  | null;
  file?: Blob  | null;
}