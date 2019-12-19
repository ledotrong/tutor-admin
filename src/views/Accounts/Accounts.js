import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { Badge, Card, CardBody, CardHeader, Col } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Radio, Row, Typography, Button } from 'antd';

const { Text } = Typography;

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userData: [],
      roleFilter: 'all',
      columns: [
        {
          label: 'ID',
          field: '_id',
          sort: 'asc',
          width: 50
        },
        {
          label: 'Picture',
          field: 'picture',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Registered',
          field: 'date',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Role',
          field: 'role',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Address',
          field: 'address',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
          width: 100
        }
      ]
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getBadge = status => {
    return status === 'active'
      ? 'success'
      : status === 'inactive'
      ? 'secondary'
      : status === 'pending'
      ? 'warning'
      : status === 'banned'
      ? 'danger'
      : 'primary';
  };

  getUsers = async () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZGU1ZTE1YjJkMDY1NjFkNDc2MjA0MmUiLCJyb2xlIjoibWFzdGVyIiwiaWF0IjoxNTc1ODgyNjc1fQ.gRjIyKO6wb0N5QVa5kHuXsWTF7c_GUmNsVkagvNsk2U`
      }
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/admin',
        requestOptions
      );

      let userData = await this.handleResponse(response);

      if (this.state.roleFilter !== 'all') {
        userData = userData.filter(data => data.role === this.state.roleFilter);
      }

      userData.forEach((element, index) => {
        let date = new Date(element.date);
        element._id = index + 1;
        element.date = date.toLocaleDateString();
        element.picture = (
          <img
            src={element.picture}
            style={{
              height: 50,
              width: 50,
              objectFit: 'cover',
              borderRadius: 25
            }}
            alt="profile"
          />
        );
        element.actions = (
          <div className="float-right">
            <Button
              className="mr-2"
              onClick={() => this.toggleEditItem(element)}
              type="primary"
            >
              Edit
            </Button>
            <Button
              onClick={() => this.toggleDeleteItem(element)}
              type="danger"
            >
              Delete
            </Button>
          </div>
        );
      });

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

  onChangeRoleFilter(e) {
    this.setState({ roleFilter: e.target.value });
    this.getUsers();
  }

  render() {
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
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="bg-dark">
                  <i className="fa fa-align-justify"></i>Users{'  '}
                  <small className="text-muted">user database</small>
                </CardHeader>
                <CardBody>
                  <Row className="mt-2" type="flex" justify="end">
                    <Radio.Group
                      defaultValue="a"
                      size="small"
                      buttonStyle="solid"
                      onChange={e => this.onChangeRoleFilter(e)}
                      value={this.state.roleFilter}
                      className="mr-4"
                    >
                      <Radio.Button value="all">All</Radio.Button>
                      <Radio.Button value="master">Master</Radio.Button>
                      <Radio.Button value="admin">Admin</Radio.Button>
                    </Radio.Group>
                    <Button
                      size="large"
                      type="primary"
                      icon="user-add"
                      style={{
                        backgroundColor: '#00d77d',
                        borderColor: '#00d77d'
                      }}
                    ></Button>
                  </Row>
                  <MDBDataTable
                    responsive
                    hover
                    bordered
                    data={{
                      columns: this.state.columns,
                      rows: this.state.userData
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Accounts;
