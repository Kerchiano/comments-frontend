import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentForm from "./CommentForm";

interface Comment {
  id: number;
  username: string;
  email: string;
  home_page: string | null;
  text: string;
  created_at: string;
  replies: Comment[];
}

const CommentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [comment, setComment] = useState<Comment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCommentForm, setActiveCommentForm] = useState<number | null>(
    null
  );

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

  useEffect(() => {
    fetchComment();
  }, [id]);

  const handleFormToggle = (commentId: number) => {
    if (activeCommentForm === commentId) {
      setActiveCommentForm(null);
    } else {
      setActiveCommentForm(commentId);
    }
  };

  const handleFormSuccess = () => {
    setActiveCommentForm(null);
    fetchComment();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!comment) {
    return <div>No comment found</div>;
  }

  const renderReplies = (replies: Comment[], level: number = 1) => {
    return replies.map((reply) => (
      <div
        key={reply.id}
        className="mt-4"
        style={{ marginLeft: `${level + 30}px` }}
      >
        <div className="bg-gray-100 p-2 flex">
          <div className="flex items-center">
            <UserCircle />
          </div>
          <div className="font-semibold text-lg p-2">{reply.username}</div>
          <div className="text-gray-600 p-3">
            {new Date(reply.created_at).toLocaleString()}
          </div>
        </div>
        <div className="mt-4 p-4 pl-0 bg-white">
          <p>{reply.text}</p>
        </div>
        <button
          onClick={() => handleFormToggle(reply.id)}
          className={`text-white px-3 py-1 rounded ${
            activeCommentForm === reply.id ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {activeCommentForm === reply.id ? "Don't Add Comment" : "Add Comment"}
        </button>
        {activeCommentForm === reply.id && (
          <CommentForm
            parentId={reply.id}
            fetchComments={fetchComment}
            onSuccess={handleFormSuccess}
          />
        )}
        {renderReplies(reply.replies, level + 1)}
      </div>
    ));
  };

  return (
    <div className="container w-3/4 m-auto my-20 text-left">
      <div className="mt-4" style={{ marginLeft: "0px" }}>
        <div className="bg-gray-100 p-2 flex">
          <div className="flex items-center">
            <UserCircle />
          </div>
          <div className="font-semibold text-lg p-2">{comment.username}</div>
          <div className="text-gray-600 p-3">
            {new Date(comment.created_at).toLocaleString()}
          </div>
        </div>
        <div className="mt-4 p-4 pl-0 bg-white">
          <p>{comment.text}</p>
        </div>
        <button
          onClick={() => handleFormToggle(comment.id)}
          className={`text-white px-3 py-1 mb-3 rounded ${
            activeCommentForm === comment.id ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {activeCommentForm === comment.id
            ? "Don't Add Comment"
            : "Add Comment"}
        </button>
        {activeCommentForm === comment.id && (
          <CommentForm
            parentId={comment.id}
            fetchComments={fetchComment}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
      {renderReplies(comment.replies)}
    </div>
  );
};

export default CommentDetail;
