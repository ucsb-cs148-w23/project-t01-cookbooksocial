import React, { useState } from "react";

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function ProfilePage(props) {
  //To display the state variable in the html, use the {} curly brackets.  Simple!
  return (
    <div>
      <h2>Insert Profile Page Here!</h2>
    </div>
  );
}

export default ProfilePage;
