import { useState, useContext,useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory, Redirect } from "react-router-dom";
import axios from "axios";
// import { Multiselect } from "multiselect-react-dropdown";
// import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
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
  Card,
  CardGroup,
  CardBody,
  CardText,
  CardTitle,
  CardSubtitle
} from "reactstrap";
import Nava from "./Nav";
function R_active() {
  const [alerter, setAlert] = useState(false);  
  const [jobList,setJob]=useState(false);
  var user = localStorage.getItem("user");
  const { register, handleSubmit, watch, errors, control } = useForm();
  const history = useHistory();  
  useEffect(() => {
      if(user===null)
      {
          history.push("/login");
      }
      user=JSON.parse(user);
      if(user.type==="applicant")
      {
          history.push("/login");
      }
      axios.get(`/api/recruiter/${user.id}/active`)
      .then((res)=>{
        setJob(res.data);    
        var datenow=new Date();
        console.log(res.data[0].deadline,datenow);    
      }).catch(err=>console.log(err));
  }, []);
  function deleteJob(i){
    var user = localStorage.getItem("user");
    user=JSON.parse(user);
      console.log(user.email,jobList[i]._id);
      axios.delete(`/api/recruiter/${user.id}/active/delete/${jobList[i]._id}`)
      .then((res)=>{
        setAlert(res.data);
        setTimeout(()=>setAlert(false),3000);
      }).catch(err=>console.log(err));
  }
  function onSub(data) {
      var i=Object.keys(data)[0][2];
      var ele=Object.keys(data);
      axios.patch(`/api/recruiter/${user.id}/active/edit/${jobList[i]._id}`,{
        applicationsAllowed:data[ele[0]],
        positionsAvail:data[ele[1]],        
        deadline:data[ele[2]]
      },{ headers: { "Content-Type": "application/json" }})
      .then((res)=>{
        setAlert(res.data);
        setTimeout(()=>setAlert(false),3000);
      }).catch(err=>console.log(err));
  }
  if(!jobList) return null
  return (
    <div className="d-flex justify-content-center ">
    <Nava></Nava>
      <div className="w-50 p-3">
        {alerter && <Alert color="success">{alerter}</Alert>}             
        <CardGroup>
        {jobList.map((x,i)=>(
            <Card>
                <CardBody>
                    <CardTitle>
                        Title: {x.title}
                    </CardTitle>
                    <CardSubtitle>
                        Date:  {x.datePost}
                    </CardSubtitle>
                    {/* <br/>
                    <CardSubtitle>
                        Number of applicants: {x.applicationsAllowed}
                    </CardSubtitle>
                    <br/>
                    <CardSubtitle>
                        Max Number of pos: {x.positionsAvail}
                    </CardSubtitle> */}
                    <Form onSubmit={handleSubmit(onSub)}>
                        <FormGroup>
                            <Label>number of applicants</Label>
                            <Input innerRef={register} type="number" name={`a-${i}`} defaultValue={x.applicationsAllowed}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>max number of positions</Label>
                            <Input innerRef={register} type="number" name={`p-${i}`} defaultValue={x.positionsAvail}></Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>deadline</Label>
                            <Input innerRef={register} type="date" name={`d-${i}`} defaultValue={Date.parse(x.deadline)}></Input>
                        </FormGroup>
                        <Input type="submit"/>
                    </Form>
                    <Button onClick={()=>deleteJob(i)}>delete</Button>
                </CardBody>
            </Card>
        ))}
        </CardGroup>
      </div>
    </div>
  );
}
export default R_active;
