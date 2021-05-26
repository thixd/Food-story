import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import SignInSide from './components/auth/sign_in'
import HomePage from './components/home/home';
import DiaryMain from './components/food_diary/food_diary_main';
import SnsMain from './components/sns/sns_main';
import SnsUser from './components/sns/sns_user';
import { AuthProvider } from './contexts/auth_context';
import PrivateRoute from './contexts/private_route';
import RestaurantReview from './components/resreview/restaurant_review.js';
import SinglePostView from './components/single_post/single_post.js';
import { useHistory, withRouter } from 'react-router-dom';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Route path="/diary" component={DiaryMain} />
            <Route path="/sns" component={SnsMain} />
            <Route path="/user" component={SnsUser} />
            <Route path = "/single-post" component = {SinglePostView}/>
            <Route path = "/restaurant-review" component = {RestaurantReview}/>

            <Route path="/signin" component={SignInSide} />
            
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
