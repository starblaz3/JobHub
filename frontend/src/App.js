import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Register from './Components/Register';
import A_profile from './Components/applicants/a_profile';
import R_profile from './Components/recruiters/profile';
import R_active from './Components/recruiters/active';
import MyApplications from './Components/applicants/a_myApplications';
//import Register_R from './Components/Public/Register_R';
import R_dashboard from './Components/recruiters/dashboard';
import Login from './Components/Login';
import { useState } from "react";

function App() {
  const [user, setUser] = useState(false);
  return (
    <Router>
      <Switch>
        {/* <Route exact path="/" component={Login} /> */}
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login}/>
        <Route exact path="/applicant" component={A_profile} /> 
        <Route exact path="/recruiter" component={R_profile} />
        <Route exact path="/recruiter/dashboard" component={R_dashboard} />
        <Route exact path="/recruiter/active" component={R_active} />
        <Route exact path="/applicant/myApplications" component={MyApplications} />
        {/* <Redirect to="/" />  */}
      </Switch>
    </Router>
  );
}

export default App;
