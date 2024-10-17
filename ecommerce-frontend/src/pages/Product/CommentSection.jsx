import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postComments } from "../../app/API/productsApi";
import { handleError } from "../../utils/functions";
import useNavigateTransition from "../../utils/useNavigateTransition";

const CommentSection = ({ comments, product }) => {
  const user = useSelector((state) => state.auth.user); // Get user details from Redux store
  const token = useSelector((state) => state.auth.token); // Get authentication token from Redux store
  const dispatch = useDispatch();

  const [myComment, setMyComment] = useState(); // State for user's current comment
  const [editable, setEditable] = useState(false); // State to track if the comment is editable
  const [newComment, setNewComment] = useState({}); // State for new or edited comment
  const navigateTransition = useNavigateTransition();

  const isSeller = product?.seller === user?.username; // Check if the logged-in user is the seller
  const isDisabled = !(user && (!myComment || editable)) || isSeller; // Determine if the input is disabled

  useEffect(() => {
    // Check for existing comment by the user
    const existingComment = comments.find((c) => c.username === user?.username);
    setEditable(!existingComment); // Set editable state based on existing comment
    setMyComment(existingComment); // Set the current comment to the existing one
    setNewComment(existingComment); // Set newComment to existing comment for editing
  }, [comments, user]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const data = await postComments(product.id, newComment, token); // API call to post the comment
      setMyComment(data?.comment); // Update myComment state with the returned comment
      setNewComment(data?.comment); // Update newComment state with the returned comment
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle errors if API call fails
    } finally {
      setEditable(false); // Set editable state to false after submission
    }
  };

  const handleTextareaChange = (e) =>
    setNewComment((c) => ({ ...c, content: e.target.value })); // Update newComment state based on textarea input

  const handleEditToggle = () => setEditable(!editable); // Toggle editable state for editing comments

  const handleRevertChanges = () => {
    setNewComment(myComment); // Reset newComment to the original myComment
    setEditable(false); // Set editable state to false
  };

  const renderComments = () =>
    comments
      .filter((c) => c.username !== user?.username) // Exclude the user's comment from the display
      .map((comment, index) => (
        <div key={index} className="border-b py-4 px-4 bg-gray-100 rounded-lg mb-4 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-gray-800">{comment.username || <i>Deleted User</i>}</p>
            <div className="text-xs italic text-gray-500">
              {comment.updatedAt !== comment.createdAt && (
                <span className="text-blue-500">Edited</span> // Indicate if the comment has been edited
              )}{" "}
              {new Date(comment.updatedAt).toLocaleString()}
            </div>
          </div>
          <p className="text-gray-700 text-lg">{comment.content}</p>
        </div>
      ));

  const renderSubmitButton = () => {
    // Render the submit button based on user state and comment status
    if (!user || !myComment) {
      return (
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-85 disabled:cursor-not-allowed"
          disabled={isDisabled} // Disable button if conditions are not met
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
          onClick={handleRevertChanges} // Revert changes to the previous state
        >
          Revert Changes
        </button>
      </>
    ) : (
      <button
        type="button"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
        onClick={handleEditToggle} // Trigger edit mode
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
          value={newComment?.content || ""} // Bind textarea value to newComment state
          onChange={handleTextareaChange} // Handle input changes
          placeholder={
            user
              ? isSeller
                ? "You can't review the product you sell!" // Seller cannot review their own product
                : "Write a review..."
              : "Login to review the product..." // Prompt for user login
          }
          className={`w-full border rounded-tr rounded-b p-2 ${isDisabled && "cursor-not-allowed"}`} // Apply conditional classes
          rows={isDisabled ? "2" : "3"} // Set number of rows based on editability
          required
          readOnly={isDisabled} // Make textarea read-only if conditions are met
        />
        {myComment && (
          <p className="italic text-xs text-gray-700 text-right">
            Latest Edition: {new Date(myComment.updatedAt).toLocaleString()}
          </p>
        )}
        {renderSubmitButton()}
      </form>
      {comments?.length > 0 ? (
        renderComments() // Display comments if any exist
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">No reviews yet. Be the first to leave one!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
