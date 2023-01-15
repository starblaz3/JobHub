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
} from "reactstrap";
import Nava from "./Nav";
const lang = [
  { value: "cpp", label: "cpp" },
  { value: "html", label: "html" },
  { value: "java", label: "java" },
];
const workType = [
  { value: "fulltime", label: "full-time" },
  { value: "parttime", label: "part-time" },
  { value: "home", label: "home" },
];
function R_dashboard() {
  const [alerter, setAlert] = useState(false);
  var user = localStorage.getItem("user");
  const { register, handleSubmit, watch, errors, control } = useForm();
  const history = useHistory();
  const [jobDet, setJob] = useState(false);
  useEffect(() => {
    if (user === null) {
      history.push("/login");
    }
    user = JSON.parse(user);
    if (user.type === "applicant") {
      history.push("/login");
    }
  }, []);

  function onSub(data) {
    var parts=data.deadline.split('-');
    var myDate=new Date(parts[0],parts[1]-1,parts[2]);
    myDate=myDate.toISOString();
    console.log(user.email);
    axios.post(`/api/recruiter/${user.id}/dashboard`,{
        title:data.title,
        nameRec:data.nameRec,
        emailRec:user.email,
        salary:data.salary,
        applicationsAllowed:data.applicationsAllowed,
        positionsAvail:data.positionsAvail,
        recID:user.id,
        duration:data.duration,
        deadline:myDate,
        typeJob:data.workType.value,
        skills:data.skills.map((s)=>s.value)
    },{ headers: { "Content-Type": "application/json" }})
    .then((res)=>{
        console.log(res.data);
        setAlert("added successfully");
        setTimeout(()=>setAlert(false),3000);
    })
    .catch(err=>console.log(err));
  }
  return (
    <div className="d-flex justify-content-center ">
    <Nava></Nava>
      <div className="w-50 p-3">
        {alerter && <Alert color="success">{alerter}</Alert>}
        <Form onSubmit={handleSubmit(onSub)}>
          <FormGroup>
            <Label>Title</Label>
            <Input name="title" type="text" innerRef={register}></Input>
          </FormGroup>
          <FormGroup>
            <Label>name of Rec</Label>
            <Input name="nameRec" type="text" innerRef={register}></Input>
          </FormGroup>
          <FormGroup>
            <Label>max No. of applications</Label>
            <Input
              name="applicationsAllowed"
              type="number"
              innerRef={register}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>max No. of positions</Label>
            <Input
              name="positionsAvail"
              type="number"
              innerRef={register}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Deadline</Label>
            <Input name="deadline" type="date" innerRef={register}></Input>
          </FormGroup>
          {/* put createable select here  */}
          <FormGroup>
            <Label>skills</Label>
            <Controller
              name="skills"
              control={control}
              as={CreatableSelect}
              isMulti
              defaultValue=""
              isClearable
              options={lang}
            />
            <FormFeedback>
              {errors.skills && errors.skills.message}
            </FormFeedback>
          </FormGroup>
          {/* make this also a selectable only */}
          <FormGroup>
            <Label>workType</Label>
            <Controller
              name="workType"
              control={control}
              as={Select}
              isMulti
              defaultValue=""
              isClearable
              options={workType}
            />
            <FormFeedback>
              {errors.workType && errors.workType.message}
            </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label>Duration</Label>
            <Input name="duration" type="number" innerRef={register}></Input>
          </FormGroup>
          <FormGroup>
            <Label>Salary</Label>
            <Input
              name="salary"
              type="number"
              innerRef={register({ min: 0 })}
            ></Input>
          </FormGroup>
          <Input type="submit" />
        </Form>
      </div>
    </div>
  );
}
export default R_dashboard;
