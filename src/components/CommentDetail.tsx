import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Comment {
  id: number;
  username: string;
  email: string;
  home_page: string | null;
  text: string;
  created_at: string;
}

const CommentDetail = () => {
  const { id } = useParams<{ id: string }>(); // Получаем id из URL
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/title-comments/${id}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comment");
        }
        const data: Comment = await response.json();
        setComment(data);
      } catch (error) {
        setError("Error loading comment");
      } finally {
        setLoading(false);
      }
    };

    fetchComment();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!comment) {
    return <div>No comment found</div>;
  }

  return (
    <div className="container w-3/4 m-auto my-20 text-left">
      <div className="bg-gray-100 p-2 flex">
        <div className="flex items-center">
          <UserCircle />
        </div>
        <div className="font-semibold text-lg p-2">{comment.username}</div>
        <div className="text-gray-600 p-3">
          {new Date(comment.created_at).toLocaleString()}
        </div>
      </div>
      <div className="mt-4 p-4 bg-white">
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default CommentDetail;
