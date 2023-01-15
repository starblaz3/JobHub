import { useState, useContext, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
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
import Nava from "./Nav";

function R_profile() {
  const [alerter, setAlert] = useState(false);
  var user = localStorage.getItem("user");  
  console.log(user.type);
  const { register, handleSubmit, watch, errors, control } = useForm();
  const history = useHistory();    
  const [recDet, setRec] = useState(false);  
  useEffect(()=>{
    if(user===null)
    {
        history.push("/login");
    }
    user=JSON.parse(user);
    if(user.type==="applicant")
    {        
        history.push("/login");
    }
    else{    
    axios.get(`/api/recruiter/${user.email}/profile`)
    .then((res)=>{
        setRec({
            recName:res.data.recName,
            recEmail:res.data.recEmail,
            password:res.data.password,
            bio:res.data.bio,
            contactNo:res.data.contactNo,
            id:res.data._id
        });
    }).catch(err=>console.log(err));  
    }
  },[]);
  function onSub(data) {
      axios.patch(`/api/recruiter/${recDet.id}/profile`,{
          recName:data.recName,
          recEmail:data.recEmail,
          contactNo:data.contactNo,
          bio:data.bio
      }, {headers: { "Content-Type": "application/json" },})
      .then((res)=>{
          setAlert(res.data);
          setTimeout(()=>setAlert(false),3000);
      }).catch(err=>console.log(err));
  }
  if(!recDet) return null
  return (
    <div className="d-flex justify-content-center ">
      <Nava></Nava>
      <div className="w-50 p-3">
        {alerter && <Alert color="success">{alerter}</Alert>}
        <Form onSubmit={handleSubmit(onSub)}>
          <FormGroup>
            <Label>name</Label>
            <Input type="text" name="recName" defaultValue={recDet.recName} innerRef={register} />
          </FormGroup>
          <FormGroup>
            <Label>email</Label>
            <Input type="email" name="recEmail" defaultValue={recDet.recEmail} innerRef={register} />
          </FormGroup>
          <FormGroup>
            <Label>password</Label>
            <Input type="password" name="password"  defaultValue={recDet.password} innerRef={register} />
          </FormGroup>
          <FormGroup>
            <Label>contact No</Label>
            <Input type="number" name="contactNo" defaultValue={recDet.contactNo} innerRef={register} />
          </FormGroup>
          <FormGroup>
            <Label>bio</Label>
            <Input type="textarea" name="bio" defaultValue={recDet.bio} innerRef={register} />
          </FormGroup>
          <Input type="submit" />
        </Form>
      </div>
    </div>
  );
}
export default R_profile;
