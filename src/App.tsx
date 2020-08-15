import React from "react";
import "./App.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./components/home/Home";
import Header from "./components/Header";
import Results from "./components/results/Results";
import Donate from "./components/donate/Donate";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/results" component={Results} />
          <Route exact path="/donate" component={Donate} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
