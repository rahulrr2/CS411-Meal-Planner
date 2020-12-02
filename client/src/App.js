import { Route, Switch, Router } from 'react-router-dom';
import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import Login from './containers/Login';
import Recipes from './containers/Recipes';
import MealPlanner from './containers/MealPlanner';
import Profile from './containers/Profile';

export const history = createBrowserHistory();

class App extends Component {
  
  render() {   
     
    return (
      <div>
        <Router history={history}>
              <Switch>
                  {/* <Route exact path='/' component={MealPlanner}/>  */}
                  <Route exact path='/' component={Login}/> 
                  {/* <Route exact path={'/mealPlanner'} component={MealPlanner}/>  */}
                  <Route path={'/mealPlanner/:userID/:userBMR'} 
                    render={props => <MealPlanner  {...props} userID={props.match.params.userID}userBMR={props.match.params.userBMR}/>} /> 
                  <Route path={'/profile/:userID'} 
                    render={props => <Profile  {...props} userID={props.match.params.userID} />} />
                  <Route path={'/recipes/:userID/:userBMR'} 
                    render={props => <Recipes  {...props} userID={props.match.params.userID} userBMR={props.match.params.userBMR} />} />  
              </Switch>
        </Router>
      </div>
    );
  }
}


export default App;
