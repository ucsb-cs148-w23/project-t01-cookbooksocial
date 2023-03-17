import React, { useEffect, useState } from "react";
import RecipePost from "../../components/RecipePosts/RecipePost";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Navbar/Navbar";
import { FaSpinner } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { useQuery } from "@tanstack/react-query";
import "./HomePage.css";

function HomePage() {
    const [filteredRecipePostList, setFilteredRecipePostList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterDis, setFilterDis] = useState(false);
    const { currentUser } = useAuth();

    const POSTS_AT_A_TIME = 5;
    const [numPosts, setNumPosts] = useState(
        parseInt(sessionStorage.getItem("numPosts")) || POSTS_AT_A_TIME
    );

    const { data: recipeData, isLoading: recipeLoading } = useQuery({
        queryKey: ["recipes"],
        queryFn: () => fetch("/api/recipe/all").then((res) => res.json()),
    });

    const { data: friendsData, isLoading: friendsLoading } = useQuery({
        queryKey: ["friends"],
        queryFn: () => fetch(`/api/user/friendsList/${currentUser.uid}`).then((res) => res.json()),
    });

    useEffect(() => {
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
            setFilteredRecipePostList(recipeData);
            setIsLoading(false);
            setFilterDis(false);
            const scrollPosition = sessionStorage.getItem("scrollPosition");
            if (scrollPosition !== null) {
                document.documentElement.style.scrollBehavior = "smooth";
                window.scrollTo(0, parseInt(scrollPosition));
            }
        }
    }, [recipeData]);

    const fetchMoreData = () => {
        setNumPosts((prevNumPosts) => prevNumPosts + POSTS_AT_A_TIME);
        sessionStorage.setItem("numPosts", numPosts + POSTS_AT_A_TIME);
    };

    const filterByAll = async () => {
        setFilterDis(true);
        setIsLoading(true);
        await setFilteredRecipePostList(recipeData);
        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsLoading(false);
        setFilterDis(false);
    };

    const filterByFriends = async () => {
        setFilterDis(true);
        setIsLoading(true);
        await setFilteredRecipePostList(
            friendsLoading
                ? []
                : !friendsData
                ? []
                : recipeData.filter((recipePost) =>
                      Object.keys(friendsData).includes(recipePost.uid)
                  )
        );

        await new Promise((resolve) => setTimeout(resolve, 400));
        setIsLoading(false);
        setFilterDis(false);
    };
    const filterByLikes = async () => {
        setFilterDis(true);
        setIsLoading(true);
        const recipePostsCopy = recipeData.slice();
        const top10Posts = recipePostsCopy
            .sort((postA, postB) => postB.likesByUid.length - postA.likesByUid.length)
            .slice(0, 10);
        await setFilteredRecipePostList(top10Posts);
        /// console.log(top10Posts)
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
                            next={fetchMoreData}
                            hasMore={numPosts < filteredRecipePostList.length}
                            loader={
                                <div className="loading-container">
                                    <FaSpinner className="loading-spinner" />
                                </div>
                            }
                        >
                            {filteredRecipePostList.slice(0, numPosts).map((recipe, index) => (
                                <RecipePost key={index} recipe={recipe} />
                            ))}
                        </InfiniteScroll>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomePage;
