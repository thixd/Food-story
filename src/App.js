import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import SignInSide from './components/auth/sign_in'
import SignUpSide from './components/auth/sign_up'
import HomePage from './components/home/home';
import DiaryMain from './components/food_diary/food_diary_main';
import SnsMain from './components/sns/sns_main';
import SnsUser from './components/sns/sns_user';
import { AuthProvider } from './contexts/auth_context';
import PrivateRoute from './contexts/private_route';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/diary" component={DiaryMain} />
            <Route path="/sns" component={SnsMain} />
            <Route path="/user" component={SnsUser} />

            <Route path="/signup" component={SignUpSide} />
            <Route path="/signin" component={SignInSide} />
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
