import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import { Badge, Button } from 'antd';
import LoadingOverlay from 'react-loading-overlay';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      banAction: false,
      userData: [],
      user: null,
      token: null
    };
  }

  componentDidMount = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) this.setState({ token });
    const userData = await this.getUsers(token);
    let user = null;
    let banAction = false;

    if (userData) {
      user = userData.find(
        user => user._id.toString() === this.props.match.params.id
      );

      if (user) {
        if (user.status === 'banned') banAction = true;
        user.picture = (
          <img
            src={user.picture}
            style={{
              height: 250,
              width: 250,
              objectFit: 'cover',
              borderRadius: 125
            }}
            alt="profile"
          />
        );
        user.status = (
          <Badge status={this.getBadge(user.status)} text={user.status}></Badge>
        );
        user.date = new Date(user.date).toLocaleString();
        user.address = Object.values(user.address).join(', ');
        user.skills = Object.values(user.skills).join(', ');
        user.wages = user.wages + ' VND/night';
      }

      this.setState({ user: user, banAction });
    }
  };

  getBadge = status => {
    return status === 'active'
      ? 'success'
      : status === 'inactive'
      ? 'default'
      : status === 'banned'
      ? 'error'
      : 'primary';
  };

  getUsers = async token => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/users',
        requestOptions
      );

      let userData = await this.handleResponse(response);

      this.setState({ loading: false, userData: userData });

      return userData;
    } catch (err) {
      return err;
    }
  };

  handleResponse(response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          // logoutUser();
        }

        // const error = (data && data.message) || response.statusText;
        // return Promise.reject(error);
        return data;
      }
      return data;
    });
  }

  banUserAction = async () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      }
    };
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/ban-user/${this.state.user._id}`,
        requestOptions
      );

      const data = await this.handleResponse(response);
      let user = this.state.user;
      user.status = <Badge status={this.getBadge(data)} text={data}></Badge>;

      this.setState({ loading: false, user, banAction: !this.state.banAction });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    let user = this.state.user;
    if (!user) {
      user = { id: 'Not found' };
    }

    const details = [
      ['Name', user.name],
      ['Email', user.email],
      ['Address', user.address],
      ['Role', user.role],
      ['Skills', user.skills],
      ['Date registered', user.date],
      ['Wages', user.wages],
      ['Status', user.status],
      ['Introduction', user.introduction]
    ];

    return (
      <div className="animated fadeIn">
        <LoadingOverlay
          active={this.state.loading}
          spinner
          text="Loading..."
          styles={{
            overlay: base => ({
              ...base,
              background: 'rgba(255, 255, 255, 0.5)',
              color: 'black'
            }),
            spinner: base => ({
              ...base,
              width: '100px',
              '& svg circle': {
                stroke: 'rgba(255, 0, 0, 0.5)'
              }
            })
          }}
        >
          <Row className="justify-content-center">
            <Col lg={12}>
              <Card>
                <CardHeader className="bg-dark">
                  <strong>
                    <i className="icon-info pr-1"></i>User id:{' '}
                    {this.props.match.params.id}
                  </strong>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={3} className=" mt-4">
                      <Row className="justify-content-center font-weight-bold mb-3">
                        <h2 className="text-uppercase name-font">
                          {user.name}
                        </h2>
                      </Row>
                      <Row className="justify-content-center">
                        {user.picture}
                      </Row>
                      {/* <Table responsive hover>
                        <tbody>
                          {userDetails.map(([key, value]) => {
                            if (
                              key !== "_id" &&
                              key !== "googleProvider" &&
                              key !== "facebookProvider"
                            )
                              return (
                                <tr key={key}>
                                  <td>{`${key}:`}</td>
                                  <td>
                                    <strong>{value}</strong>
                                  </td>
                                </tr>
                              );
                          })}
                        </tbody>
                      </Table> */}
                    </Col>
                    <Col className="ml-4 mt-4" lg={8}>
                      <Table responsive bordered hover>
                        <tbody>
                          {details.map(([key, value]) => {
                            return (
                              <tr key={key}>
                                <td>{`${key}:`}</td>
                                <td>
                                  <strong>{value}</strong>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                      <Row className="justify-content-end mr-2">
                        <Button
                          onClick={() => this.banUserAction()}
                          type={this.state.banAction ? 'primary' : 'danger'}
                        >
                          {this.state.banAction ? 'Unban' : 'Ban'}
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </LoadingOverlay>
      </div>
    );
  }
}

export default User;
