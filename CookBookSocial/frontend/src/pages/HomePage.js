import React, { useEffect, useState } from 'react';
import RecipePost from '../components/recipe_posts/RecipePost';
import {Button} from 'react-bootstrap';

import Turkey from '../images/Turkey.jpg'
import Potatoes from '../images/potatoes.jpg'
import { render } from 'react-dom';
import './HomePage.css'
/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function HomePage() {

    //state to hold an array of json objects of recipe posts (TWO FILLER POSTS FOR NOW AS EXAMPLES)
    const [recipePostsList, updateRecipePostsList] = useState([{
        username: "Will Mori",
        title: "Turkey",
        image: Turkey,
        description: "FILLER DESCRIPTION FOR TESTING PURPOSES TURKEY DJLSDJF L:SDJF:SL DFJKSDL:K FJSDL:KFJS: LDKFJ S:LKDFJ: SLDKFJS LDKMJFK SLDF:JS DL:KFJ SDLFJ SDKL:F J:SDLKJF SD:KLFJ S:LDKFJ :SLKD FJS:DLFKJD SL:FKJSD LFKJ"
    }, {
        username: "Bryan Zamora",
        title: "Potatoes",
        image: Potatoes,
        description: "FILLER DESCRIPTION FOR TESTING PURPOSES POTATOES DJLSDJF L:SDJF:SL DFJKSDL:K FJSDL:KFJS: LDKFJ S:LKDFJ: SLDKFJS LDKMJFK SLDF:JS DL:KFJ SDLFJ SDKL:F J:SDLKJF SD:KLFJ S:LDKFJ :SLKD FJS:DLFKJD SL:FKJSD LFKJ"
    }])

    /*
    This will fetch the list of recipe posts stored in the database 
    as an array of json objects. It will then save it in the state variable recipePostsList.
    It will refresh and check for new posts everytime the page refreshes.
    "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
    the backend.
    */
    /*
    useEffect(() => {
        fetch(URL_GET_RECIPE_POSTS_DATA)
            .then((response) => response.json())
            .then((data) => updateRecipePostsList(data))
    }, [])
    */

    function renderRecipePostComponents() {
        const arrComponents = []
        for (let i = 0; i < recipePostsList.length; i++) {
            arrComponents.unshift(
            <RecipePost username={recipePostsList[i].username}
                        title={recipePostsList[i].title}
                        image={recipePostsList[i].image}
                        description={recipePostsList[i].description}/>)
        }
        return arrComponents
    }


    //To display the state variable in the html, use the {} curly brackets.  Simple!
    return (
    <div className='home-page'> 
        <Button className="new-post-btn" variant="primary">New Post</Button>
        <ul>
            {renderRecipePostComponents()}
        </ul>
    </div>
    );
}

export default HomePage;