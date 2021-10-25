import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import Login from "./component/Login";
import ChatBot from "./component/ChatBot";
import SignUp from "./component/SignUp";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Login}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/chat' component={ChatBot}/>
        <Route exact path='/signUp' component={SignUp}/>
        </Switch>
        </Router>
  );
}

export default App;
