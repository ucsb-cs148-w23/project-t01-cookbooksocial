

import React from 'react'
import Button from 'react-bootstrap/Button';


export default function loginButton() {
    return (
        <div className="loginButton-container">
            <Button variant="secondary" size="lg">
                Login
            </Button>
        </div>
    )
}