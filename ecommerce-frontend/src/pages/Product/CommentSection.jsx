import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postComments } from "../../app/API/productsApi";
import { handleError } from "../../hooks/functions";
import useNavigateTransition from "../../hooks/useNavigateTransition";

const CommentSection = ({ comments, product }) => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const [myComment, setMyComment] = useState();
  const [editable, setEditable] = useState(false);
  const [newComment, setNewComment] = useState({});
  const navigateTransition = useNavigateTransition();

  const isSeller = product?.seller === user?.username;
  const isDisabled = !(user && (!myComment || editable)) || isSeller;

  useEffect(() => {
    const existingComment = comments.find((c) => c.username === user?.username);
    setEditable(!existingComment);
    setMyComment(existingComment);
    setNewComment(existingComment);
  }, [comments, user]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await postComments(product.id, newComment, token);
      setMyComment(data?.comment);
      setNewComment(data?.comment);
    } catch (err) {
      handleError(err, navigateTransition, dispatch)
    } finally {
      setEditable(false);
    }
  };

  const handleTextareaChange = (e) =>
    setNewComment((c) => ({ ...c, content: e.target.value }));

  const handleEditToggle = () => setEditable(!editable);

  const handleRevertChanges = () => {
    setNewComment(myComment);
    setEditable(false);
  };

  const renderComments = () =>
    comments
      .filter((c) => c.username !== user?.username)
      .map((comment, index) => (
        <div key={index} className="border-b py-4 px-4 bg-gray-100 rounded-lg mb-4 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-gray-800">{comment.username || <i>Deleted User</i>}</p>
            <div className="text-xs italic text-gray-500">
              {comment.updatedAt !== comment.createdAt && (
                <span className="text-blue-500">Edited</span>
              )}{" "}
              {new Date(comment.updatedAt).toLocaleString()}
            </div>
          </div>
          <p className="text-gray-700 text-lg">{comment.content}</p>
        </div>
      ));

  const renderSubmitButton = () => {
    if (!user || !myComment) {
      return (
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-85 disabled:cursor-not-allowed"
          disabled={isDisabled}
        >
          Post Review
        </button>
      );
    }
    return editable ? (
      <>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Save Edit
        </button>
        <button
          type="button"
          className="bg-red-500 text-white px-4 ml-4 py-2 rounded-lg font-semibold"
          onClick={handleRevertChanges}
        >
          Revert Changes
        </button>
      </>
    ) : (
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
        onClick={handleEditToggle}
      >
        Edit
      </button>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      <p className="px-4 py-1 text-sm rounded-tr rounded-tl bg-gray-200 w-fit">My Review</p>
      <form onSubmit={handleCommentSubmit} className="mb-4">
        <textarea
          value={newComment?.content || ""}
          onChange={handleTextareaChange}
          placeholder={
            user
              ? isSeller
                ? "You can't review the product you sell!"
                : "Write a review..."
              : "Login to review the product..."
          }
          className={`w-full border rounded-tr rounded-b p-2 ${isDisabled && "cursor-not-allowed"}`}
          rows={isDisabled ? "2" : "3"}
          required
          readOnly={isDisabled}
        />
        {myComment && (
          <p className="italic text-xs text-gray-700 text-right">
            Latest Edition: {new Date(myComment.updatedAt).toLocaleString()}
          </p>
        )}
        {renderSubmitButton()}
      </form>
      {comments?.length > 0 ? (
        renderComments()
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No reviews yet. Be the first to leave one!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
