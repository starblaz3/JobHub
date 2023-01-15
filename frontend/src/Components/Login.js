import { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  FormText,
  Container,
  Button,
  Alert,
} from "reactstrap";
//dont know res format in line 39


function Login() {
  const [user, setUser] = useState(false);  
  const [alerter,setAlert] = useState(false);
  const history=useHistory();
  const { register, handleSubmit, watch, errors, control } = useForm();
  useEffect(()=>{
      localStorage.clear();
  },[])
  useEffect(() => {      
      if(user!=null){
    localStorage.setItem('user', JSON.stringify(user));}
  }, [user]);
  function onSub(data) {
    console.log(data);
    if (data.jobType == "applicant") {
      axios
        .post("/api/login",
          {
            type: data.jobType,
            emailID: data.email,
            password: data.password
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          console.log(res);          
          if (res.data.body == "true") {
            setUser( {
              type: data.jobType,
              email: data.email,
              id:res.data.id
            });                        
            setAlert("login successful");
            setTimeout(()=>setAlert(false),3000);
            history.push('/applicant');
          }
          else{
            setAlert("F");
            setTimeout(()=>setAlert(false),3000);
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post("/api/login",
          {
            type: data.jobType,
            recEmail: data.email,
            password: data.password
          },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          console.log(res);
          if (res.data.body == "true") {
            setUser( {
                type: data.jobType,
                email: data.email,
                id:res.data.id
              });        
            setAlert("login successful");
            setTimeout(()=>setAlert(false),3000);
            history.push('/recruiter');
          }
          else{
            setAlert("F");
            setTimeout(()=>setAlert(false),3000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  return (
    <div className="d-flex justify-content-center ">
      <div className="w-50 p-3">
        {alerter && <Alert color="success">{alerter}</Alert>}
        <Form onSubmit={handleSubmit(onSub)}>
          <FormGroup>
            <Input type="select" name="jobType" innerRef={register}>
              <option value="applicant">applicant</option>
              <option value="recruiter">recruiter</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>enter email:</Label>
            <Input type="email" name="email" innerRef={register} />
          </FormGroup>
          <FormGroup>
            <Label>enter password:</Label>
            <Input type="password" name="password" innerRef={register} />
          </FormGroup>
          <Input type="submit" />
        </Form>
      </div>
    </div>
  );
}
export default Login;
