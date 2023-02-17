import RecipePost from "../../../components/recipe_posts/RecipePost";

import { render, screen } from "@testing-library/react";

import postFixture from "../../fixtures/postFixture";

describe("Recipe Post Tests", () => {
  test("Testing that recipe post component renders", async () => {
    const postItems = postFixture;

    render(
      <RecipePost
        title={postItems.title}
        email={postItems.email}
        image={postItems.image}
        description={postItems.description}
        ingredients={postItems.ingredients}
        instructions={postItems.instructions}
      ></RecipePost>
    );

    expect(await screen.findByText("TestEmail@gmail.com")).toBeInTheDocument();
  });
});
