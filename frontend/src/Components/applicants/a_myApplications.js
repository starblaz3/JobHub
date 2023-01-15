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
import NavM from "./Nav";
function MyApplications() {
  const [alerter, setAlert] = useState(false);
  const [jobList,setJob]=useState(false);
  const [ratingx,setRating] = useState("0");
  var user = localStorage.getItem("user");  
  const { register, handleSubmit, watch, errors, control } = useForm();
  const history = useHistory();  
  useEffect(() => {
      if(user===null)
      {
          history.push("/login");
      }
      user=JSON.parse(user);
      if(user.type==="recruiter")
      {
          history.push("/login");
      }      
      axios.get(`/api/applicant/${user.id}/myApplications`)
      .then((res)=>{
        console.log(res.data);
        var obje=[];
        for(var i=0;i<res.data.length;i++)
        {
            for(var j=0;j<res.data[i].link.length;j++)
            {
                if(res.data[i].link[j].appID.toString()===user.id.toString()){
                    obje.push({
                        id:res.data[i]._id,
                        title:res.data[i].title,
                        dateJoin:res.data[i].link[j].dateJoin,
                        salary:res.data[i].salary,
                        nameRec:res.data[i].nameRec,
                        rating:res.data[i].ratingJob,
                        ratingDen:res.data[i].ratingDen                        
                    });
                }
            }
        }
        setJob(obje);
        console.log(obje);  
      }).catch(err=>console.log(err));
  }, []);  
  function onSub(value) {      
      setRating(value);      
  }
  function onSubx(i) {
    var user=localStorage.getItem("user");
    user=JSON.parse(user);    
    console.log(ratingx);      
    axios.post(`/api/applicant/${user.id}/myApplications/${jobList[i].id}`,{
          rating:ratingx
    },{headers: { "Content-Type": "application/json" }})
}
  if(!jobList) return null
  return (
    <div className="d-flex justify-content-center ">
    <NavM></NavM>
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
                        Date join:  {x.dateJoin}
                    </CardSubtitle>
                    {/* <br/>
                    <CardSubtitle>
                        Number of applicants: {x.applicationsAllowed}
                    </CardSubtitle>
                    <br/>
                    <CardSubtitle>
                        Max Number of pos: {x.positionsAvail}
                    </CardSubtitle> */}                    
                    <CardSubtitle>
                        salary:  {x.salary}
                    </CardSubtitle>
                    <CardSubtitle>
                        nameRec:  {x.nameRec}
                    </CardSubtitle>
                    <input type="number" value={ratingx} id={i} onChange={e => onSub(e.target.value)} />
                    <Button type="submit" onClick={()=>onSubx(i)}>hello</Button>
                </CardBody>
            </Card>
        ))}
        </CardGroup>
      </div>
    </div>
  );
}
export default MyApplications;
