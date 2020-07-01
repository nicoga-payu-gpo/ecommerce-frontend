import React, {useEffect} from 'react';
import NavigationDrawer from "./Components/NavigationDrawer";
import {BrowserRouter as Router, Redirect, Route, Switch,} from "react-router-dom";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";

export default function App() {
    const [loggedIn, setLoggedIn] = React.useState(false);
    useEffect(() => {
        if (localStorage.getItem("accessToken") != null) {
            setLoggedIn(true);
        }
    }, []);
    return (
        <Router>

                {loggedIn === false ?
                    <Switch>
                        <Route  path="/home" component={NavigationDrawer}/>
                        <Route  path="/signIn" component={SignIn}/>
                        <Route  path="/signUp" component={SignUp}/>
                        <Route render={() => <Redirect to="/home"/>}/>
                    </Switch>
                    :
                    <Switch>
                        <Route path="/home" component={NavigationDrawer}/>
                        <Route render={() => <Redirect to="/home"/>}/>
                    </Switch>

                }

        </Router>
    );
}
