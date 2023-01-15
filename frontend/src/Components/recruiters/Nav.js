import React, { useState } from "react";
import { useHistory, Link, Redirect } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
} from "reactstrap";

function Nava(props)  {
  const history = useHistory();

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/login">login</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink href="/recruiter">profile</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/recruiter/dashboard">dashboard</NavLink>
            </NavItem>       
            <NavItem>
              <NavLink href="/recruiter/active">active</NavLink>
            </NavItem>            
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Nava;