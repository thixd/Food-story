import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import SignInSide from './components/auth/sign_in'
import HomePage from './components/home';
import DiaryMain from './components/food_diary/food_diary_main';
import SnsMain from './components/sns/sns_main';
import SnsUser from './components/sns/sns_user';

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path="/" component={SignInSide} />
          <Route path="/home" component={HomePage} />
          <Route path="/diary" component={DiaryMain} />
          <Route path="/sns" component={SnsMain} />
          <Route path="/user" component={SnsUser} />
      </Switch>
    </Router>
  )
}

export default App;
