import React, { useEffect, useState } from "react";
import Navbars from "../../components/navbars/Navbars";
import SavedPageContent from "../../components/SavedPageContent/SavedPageContent";


function SavedPage() {

  return (
    <div>
      <Navbars />
      <div className="saved-page">
        <SavedPageContent></SavedPageContent>
      </div>
    </div>
  );
}


export default SavedPage;
