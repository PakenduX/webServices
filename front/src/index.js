import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import ArxivHal from "./views/ArxivHal";
import SignUp from "./views/SignUp";
import SignIn from "./views/SignIn";
import SnackbarProvider from "./components/SnackBar";
import TokenPage from "./views/TokenPage";

ReactDOM.render(
    <SnackbarProvider>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/search" component={ArxivHal} />
                    <Route path="/signUp" component={SignUp} />
                    <Route exact path="/" component={SignIn} />
                    <Route path="/accessToken" component={TokenPage} />
                </Switch>
            </div>
        </BrowserRouter>
    </SnackbarProvider>,
    document.getElementById('root')
);

serviceWorker.unregister();
