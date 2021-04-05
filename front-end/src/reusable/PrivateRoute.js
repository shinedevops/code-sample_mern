import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ render: Render, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            localStorage.getItem('token') ? (
                <Render {...props} />
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);

export default PrivateRoute;
