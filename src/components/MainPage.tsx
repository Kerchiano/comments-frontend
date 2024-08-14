import { useState } from "react";
import { Comment, CommentResponse } from "../types/commentTypes";
import { useDebounce } from "../hooks/useDebounce";
import CommentForm from "./CommentForm";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [createdAtOrder, setCreatedAtOrder] = useState<"fifo" | "lifo" | "">(
    ""
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const navigate = useNavigate();

  const fetchComments = () => {
    const url = new URL("http://127.0.0.1:8000/api/title-comments/");

    if (username) url.searchParams.append("username", username);
    if (email) url.searchParams.append("email", email);

    url.searchParams.append("created_at", createdAtOrder);
    url.searchParams.append("page", currentPage.toString());

    fetch(url.toString())
      .then((response) => response.json())
      .then((data: CommentResponse) => {
        setComments(data.results);
        setTotalPages(Math.ceil(data.count / 2));
      })
      .catch((error) => console.error("Error fetching comments:", error));
  };

  useDebounce(fetchComments, 300, [
    username,
    email,
    createdAtOrder,
    currentPage,
  ]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCommentClick = (commentId: number) => {
    navigate(`/detail-title-comments/${commentId}`);
  };

  return (
    <>
      <div className="container w-11/12 m-auto my-20">
        <h1 className="text-xl font-bold mb-6">Heading comments</h1>
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 w-1/5 min-w-24"
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-1/5 min-w-24"
          />
          <select
            value={createdAtOrder}
            onChange={(e) =>
              setCreatedAtOrder(e.target.value as "fifo" | "lifo")
            }
            className="border p-2 w-1/12 min-w-16"
          >
            <option value="">---</option>
            <option value="fifo">FIFO</option>
            <option value="lifo">LIFO</option>
          </select>
        </div>
        <table className="flex flex-col bg-white border border-gray-300">
          <thead>
            <tr className="flex">
              <th className="py-2 px-4 border-b border-r w-1/6">Username</th>
              <th className="py-2 px-4 border-b border-r w-1/6">Email</th>
              <th className="py-2 px-4 border-b border-r w-1/6">Home Page</th>
              <th className="py-2 px-4 border-b border-r w-2/6">Text</th>
              <th className="py-2 px-4 border-b w-1/6">Created At</th>
              <th className="py-2 px-4 border-b w-1/12 border-l">Detail</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id} className="border-b flex">
                <td className="py-2 px-4 border-r w-1/6">{comment.username}</td>
                <td className="py-2 px-4 border-r w-1/6">{comment.email}</td>
                <td className="py-2 px-4 border-r w-1/6">
                  {comment.home_page || "N/A"}
                </td>
                <td className="py-2 px-4 border-r w-2/6">{comment.text}</td>
                <td className="py-2 px-4 w-1/6">{comment.created_at}</td>
                <td className="py-2 px-4 w-1/12 border-l">
                  <button
                    onClick={() => handleCommentClick(comment.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Previous
          </button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
      <CommentForm parentId={undefined} fetchComments={fetchComments} />
    </>
  );
};

export default MainPage;
