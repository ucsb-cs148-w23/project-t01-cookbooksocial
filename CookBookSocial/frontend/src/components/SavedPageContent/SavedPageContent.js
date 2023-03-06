import React, { useEffect, useState } from "react";
import SavedRecipePost from "./SavedRecipePost/SavedRecipePost";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useAuth } from "../../contexts/AuthContext";

// reorder item
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
export default function SavedPageContent () {
  const [recipePostsList, updateRecipePostsList] = useState([]);
  const { currentUser } = useAuth();
  useEffect(() => {
    //change here to user/saved
    const URL_GET_SAVED_RECIPE_POSTS_DATA = `/api/recipe/savedPost/${currentUser.uid}`;
    const access_db = () => {
      fetch(URL_GET_SAVED_RECIPE_POSTS_DATA)
        .then((response) => response.json())
        .then((data) => updateRecipePostsList(data));
    };
    access_db();
    }, []);

  const onDragEnd = (result) => {
    // no drag
    if (!result.destination) {
      return;
    }
    // reorder item
    let movedItems = reorder(
      recipePostsList,
      result.source.index,
      result.destination.index 
    );
    updateRecipePostsList(movedItems);
    //update data at database(fix here)

  };

  const deleteSavedRecipe = (index) => {

    // reorder item
    const result = Array.from(recipePostsList);
    result.splice(index, 1);
    //updateRecipePostsList(result);
    console.log("deleted")
    //update data at database(fix here)

  };
  console.log(recipePostsList)
  return (
    // draggable area
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {recipePostsList.map((savedRecipe, index) => (
              <Draggable
                key={savedRecipe.id}
                draggableId={"q-" + savedRecipe.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div>
                    <SavedRecipePost 
                      deletePost = {() => {
                          const newRecipePostsList = [...recipePostsList];
                          newRecipePostsList.splice(index, 1);
                          updateRecipePostsList(newRecipePostsList);
                          //update database
                          console.log(recipePostsList[index].id)
                          const URL_DELETE_SAVED_RECIPE_POSTS = `/api/recipe/savedPost/${recipePostsList[index].id}/${currentUser.uid}`;
                          const response = fetch(URL_DELETE_SAVED_RECIPE_POSTS, {
                            method: 'DELETE',
                            headers: {
                            }
                         });
                        }
                        }
                      key={index} 
                      recipe={savedRecipe} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};