import React, { useEffect, useState } from "react";
import Navbars from "../../components/navbars/Navbars";
import PostModal from "../../components/postModal/postModal";
import SavedPageContent from "../../components/SavedPageContent/SavedPageContent";


function SavedPage() {

  return (
    <div>
      <Navbars />
      <div className="home-page">
        <div className="newPostCont">
          <PostModal></PostModal>
        </div>
        <SavedPageContent></SavedPageContent>
      </div>
    </div>
  );
}


export default SavedPage;
