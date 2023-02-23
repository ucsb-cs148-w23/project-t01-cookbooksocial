# Unit Testing & Component Testing

---

## Library:

Jest

---
## Why?

We decided to use Jest because it is a library that works quite well with the React environment. This is because React already comes with Jest pretty must set-up for you to use. Many of the functions work well with the react ecosystem. For example, you can quickly check things within components. Or you can provide each component with some sort of testing ID.

---
### Example:

We decided to test the RecipePostFunctions, more specifically, the function that renders an ingredient list based on the list of ingredients provided. 

So in the test Located at `frontend/src/tests/components/RecipePost/functions/RecipePostFunctions.test.js`

<img width="1303" alt="image" src="https://user-images.githubusercontent.com/33767941/219590055-54b0a61c-eb4c-41ef-a2a5-f36b1a8c6077.png">


Corresponding to the function:
Located at:

`frontend/src/components/recipe_posts/functions/RecipePostFunctions.jsx`

<img width="736" alt="image" src="https://user-images.githubusercontent.com/33767941/219590298-42ada9c8-d684-499e-85b5-efefd28f04c3.png">



<img width="695" alt="image" src="https://user-images.githubusercontent.com/33767941/221036414-ddc358ca-993d-4764-bd96-d4ec040dce38.png">


<img width="1375" alt="image" src="https://user-images.githubusercontent.com/33767941/221036669-a050cc89-e2c6-49e6-baee-2d439b9432fe.png">


Function that is being tested:

<img width="1250" alt="image" src="https://user-images.githubusercontent.com/33767941/221036949-c577327d-6e8a-43a0-8760-ec41718655f0.png">
