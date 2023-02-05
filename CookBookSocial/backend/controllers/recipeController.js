// newTea function for post tea route
import firebase from "../firebase.js";
const firestore = firebase.firestore();

const newRecipe = (req, res, next) => {
  res.json({ message: "POST new recipe" }); // dummy function for now
};

export { newRecipe };
