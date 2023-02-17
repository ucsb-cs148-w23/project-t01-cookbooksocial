import React, { useEffect, useState,Component } from "react";
import {Tabs, TabList, Tab, DragTabList, DragTab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import * as customStyle from 'react-tabtab/lib/themes/bulma';
import RecipePost from "../../components/recipe_posts/RecipePost";
import {simpleSwitch} from 'react-tabtab/lib/helpers/move';
import { FaPlus } from 'react-icons/fa';


const ShowSavedRecipeConent = (key) =>{
    const [savedRecipePostsList, updateSavedRecipePostsList] = useState([]);
  
    /*
    This will fetch the list of Saved recipe posts stored in the database. each saved file is related by "key" 
    as an array of json objects. It will then save it in the state variable AllrecipePostsList.
    It will refresh and check for new posts everytime the page refreshes.
    "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
    the backend.
    */
    
    //change api to saved with "key"(fix here)
    const URL_GET_SAVED_RECIPE_POSTS_DATA = "/api/recipe/all";
    
      useEffect(() => {
        fetch(URL_GET_SAVED_RECIPE_POSTS_DATA)
          .then((response) => response.json())
          .then((data) => updateSavedRecipePostsList(data));
      }, []);
  
  
    const arrComponents = [];
    for (let i = 0; i < savedRecipePostsList.length; i++) {
      arrComponents.unshift(
        <RecipePost
          key={i}
          email={savedRecipePostsList[i].email}
          title={savedRecipePostsList[i].title}
          image={savedRecipePostsList[i].image}
          description={savedRecipePostsList[i].description}
          ingredients={savedRecipePostsList[i].ingredients}
          instructions={savedRecipePostsList[i].instructions}
        />
      );
    }
  
    return(
      arrComponents
    )
    
  }

  const makeData = (number, titlePrefix = 'Tab') => {
    const data = [];
    for (let i = 0; i < number; i++) {
      data.push({
        title: `${titlePrefix} ${i}`,
        content:
          <div>
            Content {i}: show saved recipe
          </div>
      });
    }
    return data;
  }

  class SavedPageContent extends Component {
    constructor(props) {
      super(props);
      this.handleTabChange = this.handleTabChange.bind(this);
      this.handleTabSequenceChange = this.handleTabSequenceChange.bind(this);
      const tabs = makeData(3, 'Saved');
      this.state = {
        activeIndex: 0,
        tabs
      }
    }
  
    handleTabChange(index) {
      this.setState({activeIndex: index});
    }
  
    handleTabSequenceChange({oldIndex, newIndex}) {
      const {tabs} = this.state;
      const updateTabs = simpleSwitch(tabs, oldIndex, newIndex);
      this.setState({tabs: updateTabs, activeIndex: newIndex});
    }

    handleExtraButton = () => {
        const {tabs} = this.state;
        const newTabs = [...tabs, {title: 'New Tab', content: 'New Content'}];
        this.setState({tabs: newTabs, activeIndex: newTabs.length - 1});
    }

    handleEdit = ({type, index}) => {
        this.setState((state) => {
          let {tabs, activeIndex} = state;
          if (type === 'delete') {
            tabs = [...tabs.slice(0, index), ...tabs.slice(index + 1)];
          }
          if (index - 1 >= 0) {
            activeIndex = index - 1;
          } else {
            activeIndex = 0;
          }
          return {tabs, activeIndex};
        });
      }
  
    render() {
      const {tabs, activeIndex} = this.state;
      const tabsTemplate = [];
      const panelTemplate = [];
      tabs.forEach((tab, index) => {
        const closable = tabs.length > 1;
        tabsTemplate.push(<DragTab key={index} closable={closable}>{tab.title}</DragTab>)
        panelTemplate.push(<Panel key={index}>{tab.content}</Panel>)
        
      })
      return (
        <Tabs onTabEdit={this.handleEdit}
              onTabChange={this.handleTabChange}
              activeIndex={activeIndex}
              customStyle={customStyle}
              onTabSequenceChange={this.handleTabSequenceChange}
              ExtraButton={
                <ExtraButton onClick={this.handleExtraButton}>
                  <FaPlus/>
                </ExtraButton>
              }
        >
          <DragTabList>
            {tabsTemplate}
          </DragTabList>
          <PanelList>
            {panelTemplate}
          </PanelList>
        </Tabs>
      )
    }
  }

  export default SavedPageContent;