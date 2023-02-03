import React, { useState } from 'react';

/*
What does calling useState do? It declares a “state variable”. Our variable is called response but we could call it anything else, like banana. This is a way to “preserve” some values between the function calls. Normally, variables “disappear” when the function exits but state variables are preserved by React.
*/

function ExamplePage(props) {

    //State variables used to 
    const [response, setResponse] = useState(null)


    //If you are running the backend server, then this will make a get request from the backend at http://localhost:3001/
    fetch('http://localhost:3001/'
        )
        .then(res => {
            //throw error if cannot find server
            if (res.status >= 400) {
                throw new Error("server responds with error");
            }
            // This is the json received from the backend.
            console.log(res);
            return res.json();
        })
        .then(res => {
            // set the state response variable to the string inside the res json object labeled under 'info'
            console.log(res);
            // We store the response into our 'response' variable
            setResponse(res['info']);
        },
            err => {
                // catch error 
                console.log(err);
            });


    //To display the state variable in the html, use the {} curly brackets.  Simple!
    return (
    <div>
        <h1>
            {response}
        </h1>
    </div>
    );
}

export default ExamplePage;