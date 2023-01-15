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
import NavM from "./Nav";

var lang = [
  { value: "cpp", label: "cpp" },
  { value: "html", label: "html" },
  { value: "java", label: "java" },
  {value : "rick", label: "rick"}
];

function Education(x) {
  return (
    <FormGroup>
      <Label>enter name and startYear of education</Label>
      {x.ab != null ? (
        <>
          <Input
            type="text"
            name={`e-${x.id}-name`}
            defaultValue={x.ab}
            innerRef={x.register}
            placeholder="institution"
            className="p-3 my-3"
          />
          <Input
            type="number"
            defaultValue={x.cd}
            name={`e-${x.id}-startYear`}
            innerRef={x.register}
            placeholder="startYear"
          />
        </>
      ) : (
        <>
          <Input
            type="text"
            name={`e-${x.id}-name`}
            innerRef={x.register}
            placeholder="institution"
            className="p-3 my-3"
          />
          <Input
            type="number"
            name={`e-${x.id}-startYear`}
            innerRef={x.register}
            placeholder="startYear"
          />
        </>
      )}
    </FormGroup>
  );
}

function A_profile(props) {
  const [alerter, setAlert] = useState(false);
  var user = (localStorage.getItem("user")||null);
  user = JSON.parse(user);
  var appD = {};
  const { register, handleSubmit, watch, errors, control } = useForm();
  const history = useHistory();
  const [eduList, setEdu] = useState([Education]);
  const addEdu = () => setEdu([...eduList, Education]);
  const [appDet, setApp] = useState(false);
  const [dumass,setDum] =useState([]);
  console.log(user.email);
  useEffect(() => {
    axios
      .get(`/api/applicant/${user.email}/profile`)
      .then((res) => {
        setApp({
          emailID: res.data.emailID,
          username: res.data.username,
          rating: res.data.rating,
          password: res.data.password,
          accepted: res.data.accepted,          
          education: res.data.education,
          lang:res.data.lang,
          job: res.data.job,
          id: res.data._id,
        });
        // var temp=[];
        // for(var i=0;i<res.data.lang.length;i++)
        // {
        //     temp.push({
        //         value:res.data.lang[i],
        //         label:res.data.lang[i]
        //     });
        // }         
        // setDum(temp);
        console.log("edulength",res.data.education.length);        
        for(var i=0;i<res.data.education.length;i++)
        {
            addEdu();            
        }        
      })
      .catch((err) => console.log(err));
  }, []);
  function onSub(data) {
    var educations = Object.keys(data)
      .map((k) => k.slice(0, 2) === "e-" && k.slice(4) === "name" && {})
      .filter((a) => a !== false);

    Object.keys(data).forEach((k) => {
      if (k.slice(0, 2) === "e-")
        educations[parseInt(k[2])][k.slice(4)] = data[k];
    });
    for (var i = 0; i < educations.length; i++) {
      educations[i]["startYear"] = parseInt(educations[i]["startYear"]);
    }
    axios
      .patch(
        `/api/applicant/${appDet.emailID}/profile`,
        {
          username: data.username,
          emailID: appDet.emailID,
          lang: data.skills.map((s) => s.value),
          password: data.password,
          education: educations,
          id:appDet.id
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log(res.data);
        setAlert(res.data);
        setTimeout(()=>setAlert(false),3000);
      })
      .catch((err) => {
        console.log(err);
      });
  }  
  if(!appDet) return null
  return (
    <div className="d-flex justify-content-center ">
      <NavM></NavM>
      <div className="w-50 p-3">
        {alerter && <Alert color="success">{alerter}</Alert>}
        <Form onSubmit={handleSubmit(onSub)}>
          <FormGroup>
            <Label>username</Label>
            <Input
              type="text"
              defaultValue={appDet.username}
              name="username"
              innerRef={register}
            />
            {errors.username && <span>this field is required</span>}
          </FormGroup>
          <FormGroup>
            <Label>password</Label>
            <Input
              type="password"
              name="password"
              defaultValue={appDet.password}
              innerRef={register}
            />
          </FormGroup>
          <FormGroup>
            <Label>emailID</Label>
            <Input
              type="email"
              defaultValue={appDet.emailID}
              name="emailID"
              innerRef={register}
            />
          </FormGroup>
          <FormGroup>
            <Label>skills</Label>
            <Controller
              name="skills"
              control={control}
              as={CreatableSelect}
              isMulti
              defaultValue={appDet.lang!=null && appDet.lang.map((s)=>({value:s, label:s}))}
              isClearable
              options={lang}
            />
            <FormFeedback>
              {errors.skills && errors.skills.message}
            </FormFeedback>
          </FormGroup>
          <Button onClick={addEdu}>addEdu</Button>
          {eduList.map((E, i) => {
                if(appDet.education.length>i && appDet.education!=null)
                    return <E id={i} ab ={appDet.education[i].name} cd={appDet.education[i].startYear} register={register} />
                return <E id={i} register={register}/>
            })}
          <Input type="submit" />
        </Form>
        <div>rating:{appDet.rating}</div>
      </div>
    </div>
  );
}
export default A_profile;
