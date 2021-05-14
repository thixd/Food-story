import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import SignInSide from './components/sign_in'
import HomePage from './components/home';

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={SignInSide} />
          <Route path="/home" component={HomePage} />
      </Switch>
    </Router>
  )
}

export default App;
