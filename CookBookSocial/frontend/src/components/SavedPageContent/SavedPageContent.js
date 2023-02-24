import React, { useEffect, useState,Component } from "react";
import {Tabs, TabList, Tab, DragTabList, DragTab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import customStyle from './SavedPageTabs';
import RecipePost from "../../components/recipe_posts/RecipePost";
import {simpleSwitch} from 'react-tabtab/lib/helpers/move';
import DraggableList from "react-draggable-list";


//Assuming maxed file we can save is 10. Assuming each user have 10 saved file in the database. 

const GetSavedRecipesByIndex = (index =0) =>{
  const [recipePostsList, updateRecipePostsList] = useState([]);
  
  /*
  This will fetch the list of Saved recipe posts stored in the database. each saved file is related by "key" 
  as an array of json objects. It will then save it in the state variable AllrecipePostsList.
  It will refresh and check for new posts everytime the page refreshes.
  "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
  the backend.
  */


  
  //change api to get data of saved file with "file index"(fix here)
  //change api like "/api/recipe/saved(index)"
  const URL_GET_SAVED_RECIPE_POSTS_DATA = "/api/recipe/all";
  
    useEffect(() => {
      fetch(URL_GET_SAVED_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateRecipePostsList(data));
    }, []);


  const arrComponents = [];
  for (let i = 0; i <  recipePostsList.length; i++) {
    arrComponents.unshift(recipePostsList[i]);
  }

  return(
    arrComponents
  )
  
}

const DataConvertStyle =(data)=>
{
  const arrComponents = [];
  for (let i = 0; i <  data.length; i++) {
    arrComponents.unshift(<RecipePost key={i} recipe={data[i]} />);
  }

  return(
    arrComponents
  )
}

//generate initial data


function SavedPageContent () {
  const [savedRecipePostsList, updateSavedRecipePostsList] = useState([]);

  
  const MakeData = () => {
    //const [savedArrComponents,updateSavedArrComponents] = useState([]);
    //savedArrComponents[number] = GetSavedRecipesByIndex(number);
    const number = 2;
    const fileTitlePrefix ='initial';
    const initialData = [];
    const fileData = GetSavedRecipesByIndex(0);
    console.log(fileData);
    //get all data
    for (let i = 0; i < number; i++) {
      initialData.push({
        fileTitle: `${fileTitlePrefix} ${i}`,
        content:
        fileData
      });    

    }
   
    //delete data which fileTitle is null
    const data = initialData.filter((data) => (data.fileTitle !== ''))
    console.log(data);
    return data;
  }





  const [showExtra, setshowExtra] = useState(false);
  const [showArrow, setshowArrow] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabs, setTabs] = useState(MakeData());
  const [newFileName, setNewFileName] = useState();




  //tap tab
  const handleTabChange = (index) => {
    setActiveIndex(index);
  }




  //handle switch tabs
  const handleTabSequenceChange = ({oldIndex, newIndex})=> {
    const updateTabs = simpleSwitch(tabs, oldIndex, newIndex);
    setTabs(updateTabs);
    setActiveIndex(newIndex)
    //swich a file in databse(fix here)
    
  }



  //add new file 
  const handleExtraButton = () => {
    if ( newFileName != ""){
      const newTabs = [...tabs, addNewTab()];
      setTabs(newTabs);
      setActiveIndex(newTabs.length - 1)
    }
    else
    {
      console.log("new file name is null")
    }
  }

  const addNewTab =()=> {
    const tempFileName = newFileName;
    setNewFileName('');
    return (
      {fileTitle: tempFileName,
        content: 
         GetSavedRecipesByIndex()
      }
    )  
  }

  //control tab and tab's contents
  const handleEdit = ({type, index}) => {
    if (type === 'delete') {
      setTabs([...tabs.slice(0, index), ...tabs.slice(index + 1)]);
    }
    if (index - 1 >= 0) {
      setActiveIndex(index - 1);
    } else {
      setActiveIndex(0);
    }
    return {tabs, activeIndex};
  }

    

  const handleToggleExtra = e => {
    setshowExtra(showExtra);
  }
  const handleToggleArrow = e => {
    setshowArrow(showArrow);
  }
  const handleToggleModal = e => {
    setshowArrow(showModal);
  }

  console.log("time")
  const tabTemplate = [];
  const panelTemplate = [];
  tabs.forEach((tab, i) => {
    const closable = tabs.length > 1;
    tabTemplate.push(<DragTab key={i} closable={closable}>{tab.fileTitle}</DragTab>);
    panelTemplate.push(
      <Panel key={i}>
            {
              <DataConvertStyle data= {tab.content} />
            }
      </Panel>
      );
  })

  return (
    <>
    <div>
      <input
        className="inputNewFileName"
        value={newFileName}
        onChange={(event) => setNewFileName(event.target.value)}
        placeholder="Add New File"
      />
      <button onClick={handleExtraButton}>
        +
      </button>
    </div>
    <Tabs onTabEdit={handleEdit}
            onTabChange={handleTabChange}
            activeIndex={activeIndex}
            customStyle={customStyle}
            onTabSequenceChange={handleTabSequenceChange}
            showArrowButton={showArrow}
            showModalButton={showModal}
            ExtraButton={showExtra &&
              <ExtraButton onClick={this.handleExtraButton}>
                
              </ExtraButton>
            }
    >
      <DragTabList>
        {tabTemplate}
      </DragTabList>
      <PanelList>
        {panelTemplate}
      </PanelList>
    </Tabs>
    </>
  )
  
}


export default SavedPageContent;