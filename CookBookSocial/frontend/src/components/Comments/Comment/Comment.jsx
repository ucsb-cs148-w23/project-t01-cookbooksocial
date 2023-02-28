import CommentForm from "../CommentForm/CommentForm";

const Comment = ({
  comment,
  replies,
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
}) => {
    const isEditing = 
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type

};

export default Comment;
