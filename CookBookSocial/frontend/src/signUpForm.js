
import React, {useState} from 'react'

function signUpForm() {

    const [signUpFormData, setSignUpFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        username: ""
    })

    function handleChange(event) {
        const {name, value} = event.target
        setSignUpFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        if (signUpFormData.password === signUpFormData.confirmPassword) {
            console.log("Successfully signed up")
        } else {
            console.log("Passwords do not match")
        }
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email address"
                    className="form-input"
                    name="email"
                    onChange={handleChange}
                    value={signUpFormData.email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    name="password"
                    onChange={handleChange}
                    value={signUpFormData.password}
                />
                <input
                    type="password"
                    placeholder="Confirm password"
                    className="form-input"
                    name="confirmPassword"
                    onChange={handleChange}
                    value={signUpFormData.confirmPassword}
                />
                <input
                    type="text"
                    placeholder="Username"
                    className="form-input"
                    name="username"
                    onChange={handleChange}
                    value={signUpFormData.username}
                />
                <button className="form-submit">
                    Sign up
                </button>
            </form>
        </div>
    )
}

export default signUpForm