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

// export interface CommentFormProps {
//   onSubmit: (commentData: {
//     username: string;
//     email: string;
//     parent_id: number | null;
//     home_page: string;
//     captcha_text: string;
//     text: string;
//   }) => void;
// }

export interface CommentErrors {
  email?: string;
  captcha_text?: string;
  username?: string;
}

export interface CommentFormProps {
  parentId?: number;
  fetchComments: () => void
}

export type FormData = {
  username: string;
  email: string;
  home_page?: string;
  text: string;
  captcha_text: string;
};