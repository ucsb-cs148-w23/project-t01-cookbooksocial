import React, { useEffect, useState } from "react";
import RecipePost from "../../components/recipe_posts/RecipePost";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// reorder item
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// set background color when drag
const getItemStyle = (isDragging, draggableStyle) => ({
  ...draggableStyle
});
// set background color when drag
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "white" : "white",
  padding: "100px"
});

export default function SavedPageContent () {
  const [recipePostsList, updateRecipePostsList] = useState([]);
  useEffect(() => {
    const URL_GET_SAVED_RECIPE_POSTS_DATA = "/api/recipe/all";
    const access_db = async () => {
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
  };

  return (
    // draggable area
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
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
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <RecipePost key={index} recipe={savedRecipe} />
                    
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