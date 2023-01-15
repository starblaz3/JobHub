import { useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory , Redirect} from "react-router-dom";
import axios from "axios";
// import { Multiselect } from "multiselect-react-dropdown";
// import Select from 'react-select';
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

const lang = [
    { value: "cpp", label: "cpp" },
    { value: "html", label: "html" },
    { value: "java", label: "java" }
];

function Education(x) {
    return (
        <FormGroup>
            <Label >enter name and startYear of education</Label>
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
        </FormGroup>
    );
}

function Applicant(x) {
    const [eduList, setEdu] = useState([Education]);
    const addEdu = () => setEdu([...eduList, Education]);

    return (
        <>
            <FormGroup>
                <Label>username</Label>
                <Input
                    type="text"
                    placeholder="username"
                    name="username"
                    innerRef={x.register}
                />
                {x.errors.username && <span>this field is required</span>}
            </FormGroup>
            <FormGroup>
                <Label>password</Label>
                <Input
                    type="password"
                    name="password"
                    placeholder="password"
                    innerRef={x.register}
                />                
            </FormGroup>
            <FormGroup>
                <Label>emailID</Label>
                <Input
                    type="email"
                    placeholder="enter mail"
                    name="emailID"
                    innerRef={x.register}
                />
            </FormGroup>
            <FormGroup>
                <Label>skills</Label>
                <Controller
                    name="skills"
                    control={x.control}
                    as={CreatableSelect}
                    isMulti
                    defaultValue=""
                    isClearable
                    options={lang}
                />
                <FormFeedback>{x.errors.skills && x.errors.skills.message}</FormFeedback>
            </FormGroup>
            <Button onClick={addEdu}>addEdu</Button>
            {eduList.map((E, i) => (
                <E id={i} register={x.register} />
            ))}
        </>
    );
}

function Recruiter(x) {
    return (
        <>
            <FormGroup>
                <Label>name</Label>
                <Input type="text" name="recName" innerRef={x.register({ required: true })} />
            </FormGroup>
            <FormGroup>
                <Label>email</Label>
                <Input type="email" name="recEmail" innerRef={x.register({ required: true })} />
            </FormGroup>
            <FormGroup>
                <Label>password</Label>
                <Input type="password" name="password" innerRef={x.register({ required: true })} />
            </FormGroup>
            <FormGroup>
                <Label>contact No</Label>
                <Input type="number" name="contactNo" innerRef={x.register({ required: true })} />
            </FormGroup>
            <FormGroup>
                <Label>bio</Label>
                <Input type="textarea" name="bio" innerRef={x.register({ required: true })} />
            </FormGroup>
        </>
    );
}

function Register() {
    const [jobType, setJobType] = useState("applicant");
    const { register, handleSubmit, watch, errors, control } = useForm();
    const [alerter,setAlert]=useState(false);
    const history=useHistory();
    const formProps = {
        register,
        errors,
        control,
    };

      function handlechange(e) {
        setJobType(e.target.value);
        console.log(jobType);
      }

    const onSub = (data) => {        
        if (data.jobType === "applicant")
        {
            var educations = Object.keys(data)
            .map((k) => k.slice(0, 2) === "e-" && k.slice(4) === "name" && {})
            .filter((a) => a !== false);

            Object.keys(data).forEach((k) => {
                if (k.slice(0, 2) === "e-") educations[parseInt(k[2])][k.slice(4)] = data[k];
            });
            for(var i =0;i<educations.length;i++)
            {
                educations[i]["startYear"]=parseInt(educations[i]["startYear"]);
            }            
            axios.post("/api/register",{
                type:data.jobType,
                username: data.username,
                password: data.password,
                emailID: data.emailID,
                lang: data.skills.map((s)=>s.value),
                education:educations
            }, {
                headers: { "Content-Type": "application/json" },
              })
              .then((res) => {
                setAlert(res.data);
                setTimeout(()=>setAlert(false),3000);
                history.push('/login');
              })
              .catch((err)=>
              {
                  console.log(err);
              });
        } else {
            console.log(data);
            axios.post("/api/register",{
                type:data.jobType,
                recName: data.recName,
                recEmail: data.recEmail,
                password: data.password,
                contactNo: data.contactNo,
                bio: data.bio
            },{headers: { "Content-Type": "application/json" },})
            .then((res)=>{
                if(res.data=="recruiter added")
                {
                    setAlert(res.data);
                    setTimeout(()=>setAlert(false),3000);
                    history.push('/login');
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    };
    return (
        <div className="d-flex justify-content-center ">
            <div className="w-50 p-3">
                {alerter && <Alert color="success">{alerter}</Alert>}
                <Form onSubmit={handleSubmit(onSub)}>
                    <FormGroup>
                        <Label for="jobType">jobType</Label>
                        <Input
                            type="select"
                            name="jobType"
                            value={jobType}
                            innerRef={register}
                            onChange={handlechange}
                        >
                            <option value="applicant">applicant</option>
                            <option value="recruiter">recruiter</option>
                        </Input>
                    </FormGroup>
                    {jobType === "applicant" && <Applicant {...formProps} />}
                    {jobType === "recruiter" && <Recruiter {...formProps} />}
                    <Input type="submit" />
                </Form>
            </div>
        </div>
    );
}
export default Register;
