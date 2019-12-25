import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Tag } from 'antd';

import { AppNavbarBrand } from '@coreui/react';

const propTypes = {
  children: PropTypes.node
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isMaster: false
    };
  }

  componentWillMount() {
    const role = localStorage.getItem('role');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.setState({ user: user });
    }
    if (role && role === 'master') {
      this.setState({ isMaster: true });
    }
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <Link to="/">
          <AppNavbarBrand
            full={{
              src: 'https://image.flaticon.com/icons/svg/270/270023.svg',
              width: 89,
              height: 25,
              alt: 'T.T.D Logo'
            }}
            minimized={{
              src: 'https://image.flaticon.com/icons/svg/270/270023.svg',
              width: 30,
              height: 30,
              alt: 'T.T.D Logo'
            }}
          />
        </Link>

        <Nav className="d-md-down-none" navbar>
          {this.state.isMaster ? (
            <NavItem className="px-3">
              <Link to="/accounts" className="nav-link">
                <div id="v1" className="nav-button">
                  Accounts
                </div>
              </Link>
            </NavItem>
          ) : null}
          <NavItem className="px-3">
            <Link to="/users" className="nav-link">
              <div id="v3" className="nav-button">
                Users
              </div>
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/contracts" className="nav-link">
              <div id="v3" className="nav-button">
                Contracts
              </div>
            </Link>
          </NavItem>
          <NavItem className="px-3">
            <Link to="/skills" className="nav-link">
              <div id="v1" className="nav-button">
                Skills
              </div>
            </Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {this.state.user ? (
            this.state.user.role === 'master' ? (
              <Tag color="magenta">{this.state.user.role}</Tag>
            ) : (
              <Tag color="geekblue">{this.state.user.role}</Tag>
            )
          ) : null}
          <strong>{this.state.user ? this.state.user.name : null}</strong>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img
                src={
                  this.state.user
                    ? this.state.user.picture
                    : '../../assets/img/avatars/6.jpg'
                }
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
