import React, { useState } from "react";

const CommentForm = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = "",
}) => {
  const [text, setText] = useState(initialText);
  const isTextAreaDisabled = text.length === 0;

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text);
    setText("");
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <textarea
          className=""
          value={text}
          onChange={(e) => setText(e.target)}
        />
        <button className="" disabled={isTextAreaDisabled}>
          {submitLabel}
        </button>
        {hasCancelButton && (
          <button
           type="button"
           className=""
           onClick={handleCancel}
           >
            Cancel
          </button>
        )}
      </form>
    </>
  );
};

export default CommentForm;
