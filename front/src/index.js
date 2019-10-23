import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Home from './Home';

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path="/" component={Home} />
            </Switch>
        </div>
    </BrowserRouter>,
    document.getElementById('root')
);

serviceWorker.unregister();
