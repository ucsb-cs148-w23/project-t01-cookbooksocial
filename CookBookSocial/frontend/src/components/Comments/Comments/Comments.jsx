import { useState, useEffect } from "react";

import CommentForm from "../CommentForm/CommentForm";
import Comment from "../Comment/Comment";

import axios from "axios";

// make api

const Comments = ({ currentUserId, recipeId, comments }) => {
  const [backendComments, setBackendComments] = useState([]);

  const [activeComment, setActiveComment] = useState(null);

  //   We know is a parent because its parent is a null
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  const getReplies = (commentId) =>
    backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

  const addComment = (text, parentId, displayName, currentUserId) => {
    axios
      .post("/api/comments/", {
        body: text,
        username: displayName,
        userId: currentUserId,
        parentId: parentId,
        recipeId: recipeId,
      })
      .then((comment) => {
        setBackendComments([comment, ...backendComments]);
        setActiveComment(null);
      });
  };

  const updateComment = (text, commentId) => {
    // updateCommentApi(text).then(() => {
    //   const updatedBackendComments = backendComments.map((backendComment) => {
    //     if (backendComment.id === commentId) {
    //       return { ...backendComment, body: text };
    //     }
    //     return backendComment;
    //   });
    //   setBackendComments(updatedBackendComments);
    //   setActiveComment(null);
    // });
  };

  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      //   deleteCommentApi().then(() => {
      //     const updatedBackendComments = backendComments.filter(
      //       (backendComment) => backendComment.id !== commentId
      //     );
      //     setBackendComments(updatedBackendComments);
      //   });
    }
  };

  useEffect(() => {
    axios
      .get("/api/comments/all", {
        params: {
          commentsArray: comments,
        },
      })
      .then((data) => {
        setBackendComments(data);
      });
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addComment} />
      <div className="comments-container">
        {rootComments.map((rootComment) => (
          <Comment
            key={rootComment.id}
            comment={rootComment}
            replies={getReplies(rootComment.id)}
            activeComment={activeComment}
            setActiveComment={setActiveComment}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};
export default Comments;
