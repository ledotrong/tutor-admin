import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem
} from "reactstrap";
import PropTypes from "prop-types";

import { AppNavbarBrand } from "@coreui/react";
import logo from "../../assets/img/brand/logo.svg";
import sygnet from "../../assets/img/brand/sygnet.svg";

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppNavbarBrand
          full={{
            src: "https://image.flaticon.com/icons/svg/270/270023.svg",
            width: 89,
            height: 25,
            alt: "T.T.D Logo"
          }}
          minimized={{
            src: "https://image.flaticon.com/icons/svg/270/270023.svg",
            width: 30,
            height: 30,
            alt: "T.T.D Logo"
          }}
        />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <Link to="/skills" className="nav-link">
              <div id="v1" className="nav-button">
                Skills
              </div>
            </Link>
          </NavItem>
          {/* <NavItem className="px-3">
            <Link to="/projects" className="nav-link">
              <div id="v2" className="nav-button">
                Projects
              </div>
            </Link>
          </NavItem> */}
          <NavItem className="px-3">
            <Link to="/users" className="nav-link">
              <div id="v3" className="nav-button">
                Users
              </div>
            </Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img
                src={"../../assets/img/avatars/6.jpg"}
                className="img-avatar"
                alt="admin@bootstrapmaster.com"
              />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={e => this.props.onLogout(e)}>
                <i className="fa fa-lock"></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
