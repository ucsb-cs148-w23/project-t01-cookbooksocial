import RecipePost from "../../../components/recipe_posts/RecipePost";

import { render, screen } from "@testing-library/react";

import postFixture from "../../fixtures/postFixture";

describe("Recipe Post Tests", () => {
  test("Testing that recipe post component renders", async () => {
    const postItems = postFixture;

    render(<RecipePost recipe={postItems}></RecipePost>);

    // We check if all the text elements possible to render get properly rendered by the RecipePost component
    // This also makes sure that the helper functions which are used to render the RecipePost also work properly
    // We already checked that the recipe ingredients are rendered properly by testing the render ingredients function on a previous Unit test
    expect(await screen.findByText("Test Title")).toBeInTheDocument();
    expect(
      await screen.findByText("By: TestEmail@gmail.com")
    ).toBeInTheDocument();
    expect(await screen.findByText("Test Description")).toBeInTheDocument();
  });
});
