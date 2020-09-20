import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./Login/Login";
import Main from "./Main";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/" component={Main} />
      </Switch>
    </div>
  );
}

export default App;
