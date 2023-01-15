import { useState, useContext, useEffect } from "react";
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
import NavM from "./Nav";
function A_dashboard() {
  const [alerter, setAlert] = useState(false);
  var user = localStorage.getItem("user");
  const { register, handleSubmit, watch, errors, control } = useForm();
  const history = useHistory();
  useEffect(() => {}, []);

  function onSub(data) {}
  return (
    <div className="d-flex justify-content-center ">
      <NavM></NavM>
      <div className="w-50 p-3">
        {alerter && <Alert color="success">{alerter}</Alert>}
        <Form onSubmit={handleSubmit(onSub)}>

          <Input type="submit" />
        </Form>
      </div>
    </div>
  );
}
export default A_dashboard;
