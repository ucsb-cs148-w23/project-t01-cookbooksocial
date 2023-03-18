import React, { useEffect, useState } from "react";
import RecipePost from "../../components/RecipePosts/RecipePost";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import { FaSpinner } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import "./HomePage.css";
import Select from "react-select";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDis, setFilterDis] = useState(true);
    const { currentUser } = useAuth();

    const [categoriesList, setCategoriesList] = useState([]);

    const [selected, setSelected] = useState(null);

    const navigate = useNavigate();

    const POSTS_AT_A_TIME = 5;
    const [numPosts, setNumPosts] = useState(
        parseInt(sessionStorage.getItem("numPosts")) || POSTS_AT_A_TIME
    );

    const fetchRecipes = async ({ pageParam = null }) => {
        const res = await fetch(
            "/api/recipe/cursor?limit=10&sortBy=recent&lastVisible=" + pageParam
        );
        return res.json();
    };

    const {
        data: recipeData,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching: recipeLoading,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["projects"],
        queryFn: fetchRecipes,
        getNextPageParam: (lastPage, pages) => lastPage.lastCursor,
    });

    const { data: friendsData, isLoading: friendsLoading } = useQuery({
        queryKey: ["friends"],
        queryFn: () => fetch(`/api/user/friendsList/${currentUser.uid}`).then((res) => res.json()),
    });
    useEffect(() => {
        // set numPosts to number of posts within recipeData.pages, an array of pages with variable length
        if (recipeData) {
            let numPosts = 0;
            recipeData.pages.forEach((page) => {
                numPosts += page.data.length;
            });
            setNumPosts(numPosts);
            sessionStorage.setItem("numPosts", numPosts);
        }

        // Flatten recipeData into a single array of recipes.
        if (recipeData) {
            let recipes = [];
            recipeData.pages.forEach((page) => {
                page.data.forEach((recipe) => {
                    recipes.push(recipe);
                });
            });
            setRecipes(recipes);
        }
    }, [recipeData]);

    useEffect(() => {
        if (currentUser) {
            // If the user does not already have user data, we redirect them to the edit-profile
            if (!currentUser.displayName) {
                navigate("/edit-profile");
            }
        }

        const handleBeforeUnload = () => {
            sessionStorage.setItem("scrollPosition", window.scrollY);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        const scrollPosition = sessionStorage.getItem("scrollPosition");
        if (scrollPosition !== null) {
            window.scrollTo(0, parseInt(scrollPosition));
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        if (recipeData && !recipeLoading) {
            // setFilteredRecipePostList(recipeData);
            setIsLoading(false);
            setFilterDis(false);
            // const scrollPosition = sessionStorage.getItem("scrollPosition");
            // if (scrollPosition !== null) {
            //     document.documentElement.style.scrollBehavior = "smooth";
            //     setTimeout(function () {
            //         window.scrollTo(0, parseInt(scrollPosition));
            //     }, 200);
            // }
            //Remove dupes from the categories and sort alhphabetically
            const categories = new Set();
            // for (const recipe of recipeData) {
            //     if (recipe.categories) {
            //         recipe.categories.forEach((cat) => categories.add(cat));
            //     }
            // }
            // setCategoriesList([...categories].sort().map((cat) => ({ value: cat, label: cat })));
        }
    }, [recipeData, recipeLoading]);

    // const fetchMoreData = () => {
    //     setNumPosts((prevNumPosts) => prevNumPosts + POSTS_AT_A_TIME);
    //     sessionStorage.setItem("numPosts", numPosts + POSTS_AT_A_TIME);
    // };

    const customStyles = {
        option: (defaultStyles, state) => ({
            ...defaultStyles,
            color: state.isSelected ? "white" : "black",
            backgroundColor: state.isSelected ? "orange" : "#FFDC9C",
        }),
        placeholder: (defaultStyles) => ({
            ...defaultStyles,
            color: "black",
            fontWeight: "bold",
        }),
        dropdownIndicator: (defaultStyles) => ({
            ...defaultStyles,
            color: "black",
        }),

        indicatorSeparator: (defaultStyles) => ({
            ...defaultStyles,
            display: "none",
        }),

        control: (defaultStyles) => ({
            ...defaultStyles,
            backgroundColor: "#FFDC9C",
            marginTop: "10px",
            paddingTop: "3px",
            paddingBottom: "3px",
            paddingRight: "10px",
            paddingLeft: "10px",
            border: "none",
            boxShadow: "none",
            color: "white",
            fontWeight: "bold",
        }),
        singleValue: (defaultStyles) => ({ ...defaultStyles, color: "black" }),
    };

    const filterByAll = async () => {
        setFilterDis(true);
        setSelected(null);
        setIsLoading(true);

        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsLoading(false);
        setFilterDis(false);
    };

    const filterByFriends = async () => {
        setFilterDis(true);
        setSelected("");
        setIsLoading(true);
        // setFilteredRecipePostList(
        //     recipeData.filter((recipePost) => Object.keys(friendsData).includes(recipePost.uid))
        // );

        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsLoading(false);
        setFilterDis(false);
    };
    const filterByLikes = async () => {
        setFilterDis(true);
        setSelected("");
        setIsLoading(true);
        const recipePostsCopy = recipeData.slice();
        const top10Posts = recipePostsCopy
            .sort((postA, postB) => postB.likesByUid.length - postA.likesByUid.length)
            .slice(0, 10);
        // setFilteredRecipePostList(top10Posts);
        /// console.log(top10Posts)
        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsLoading(false);
        setFilterDis(false);
    };

    const filterByCategory = async (selectedOption) => {
        setIsLoading(true);

        // setFilteredRecipePostList(
        //     recipeData.filter((recipePost) => {
        //         if (recipePost["categories"]) {
        //             return recipePost["categories"].includes(selectedOption.value);
        //         }
        //     })
        // );

        setSelected(selectedOption);

        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsLoading(false);
        setFilterDis(false);
    };

    return (
        <div>
            <Navbar />
            <div className="mt-8"></div>
            <div className="max-w-2xl mx-auto my-2">
                <div>
                    <div className="filterBox">
                        <input
                            type="radio"
                            id="1"
                            disabled={filterDis}
                            onClick={filterByAll}
                            name="filter"
                            defaultChecked
                        />
                        <label htmlFor="1">All</label>
                        <input
                            type="radio"
                            id="2"
                            disabled={filterDis}
                            onClick={filterByFriends}
                            name="filter"
                        />
                        <label htmlFor="2">Friends</label>
                        <input
                            type="radio"
                            id="3"
                            disabled={filterDis}
                            onClick={filterByLikes}
                            name="filter"
                        />
                        <label htmlFor="3">Popular</label>
                        <Select
                            options={categoriesList}
                            value={selected || ""}
                            onChange={filterByCategory}
                            placeholder="Categories"
                            styles={customStyles}
                        />
                    </div>
                    <hr align="center" className="hr-line"></hr>
                </div>
                {isLoading ? (
                    <div className="loading-container">
                        <FaSpinner className="loading-spinner" />
                    </div>
                ) : (
                    <>
                        <InfiniteScroll
                            dataLength={numPosts}
                            next={fetchNextPage}
                            hasMore={hasNextPage}
                            loader={
                                <div className="loading-container">
                                    <FaSpinner className="loading-spinner" />
                                </div>
                            }
                        >
                            {recipes.map((recipe, i) => (
                                <RecipePost key={i} recipe={recipe} />
                            ))}
                        </InfiniteScroll>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomePage;
