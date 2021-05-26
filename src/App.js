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
import SharingPage from './components/food_diary/sharing_part';


function App() {
  var cac = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/sample_uid%2Fimages%2F-MaXYTuaIhhfqbyzvT37?alt=media&token=9a4460af-562c-475b-80aa-545117989978"
  var uid = "sample_uid";
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
            <Route path = "/sharing-post" component = {SharingPage}/>
            <Route path="/signin" component={SignInSide} />
            
        </Switch>
      </AuthProvider>
    </Router>
  )
}

export default App;
