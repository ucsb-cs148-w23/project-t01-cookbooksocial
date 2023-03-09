import { useState, useEffect } from "react";

import CommentForm from "../CommentForm/CommentForm";
import Comment from "../Comment/Comment";

import "./comments.css";

import axios from "axios";

import { useAuth } from "../../../contexts/AuthContext";

// make api

const Comments = ({ currentUserId, recipeId, comments }) => {
  const [backendComments, setBackendComments] = useState([]);

  const [activeComment, setActiveComment] = useState(null);

  const { currentUser } = useAuth();

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

  const addComment = (text, parentId) => {

    console.log("this is the parentID", parentId)

    axios
      .post("/api/comments/", {
        body: text,
        username: currentUser.displayName,
        userId: currentUserId,
        parentId: parentId,
        recipeId: recipeId,

      })
      .then((comment) => {
        setBackendComments([comment, ...backendComments]);
        setActiveComment(null);
      });
  };

  const addRootComment = (text) => {
    // console.log("this is a root comment", parentId)

    axios
      .post("/api/comments/", {
        body: text,
        username: currentUser.displayName,
        userId: currentUserId,
        parentId: null,
        recipeId: recipeId,

      })
      .then((comment) => {
        setBackendComments([comment, ...backendComments]);
        setActiveComment(null);
      });
  }

  const updateComment = (text, commentId) => {

    axios.put("/api/comments/edit", {
      body: text,
      commentId: commentId
    }).then(() => {
      const updatedBackendComments = backendComments.map((backendComment) => {
        if (backendComment.id === commentId) {
          return { ...backendComment, body: text };
        }
        return backendComment;
      });
      setBackendComments(updatedBackendComments);
      setActiveComment(null);
    });
  };

  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to remove comment?")) {

      // console.log("this is the object", { commentId: commentId, recipeId: recipeId })
      axios.delete("/api/comments/delete", {
        data: {
          commentId: commentId,
          recipeId: recipeId,
        }
      }).then(() => {
        const updatedBackendComments = backendComments.filter(
          (backendComment) => backendComment.id !== commentId
        );
        setBackendComments(updatedBackendComments);
      });
    }
  };

  useEffect(() => {
    axios
      .get("/api/comments/all", {
        params: {
          commentsArray: comments,
        }

      })
      .then((data) => {
        // console.log("This is the data: ", data.data)
        setBackendComments(data.data);
      });
  }, []);

  return (
    <div className="comments">
      <h3 className="comments-title">Comments</h3>
      <div className="comment-form-title">Write comment</div>
      <CommentForm submitLabel="Write" handleSubmit={addRootComment} />
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
