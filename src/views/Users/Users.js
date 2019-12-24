import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Radio, Row, Typography, Button, Badge } from 'antd';

const { Text } = Typography;

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      loading: true,
      userData: [],
      statusFilter: 'all',
      roleFilter: 'all',
      columns: [
        {
          label: 'ID',
          field: '_id',
          sort: 'asc',
          width: 50
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
          label: 'Status',
          field: 'status',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
          width: 150
        }
      ]
    };
  }

  componentWillMount = async () => {
    // const token = localStorage.removeItem("token");
    const token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      this.setState({ token });
    } else {
      this.props.history.push('/login');
    }
  };

  componentDidMount() {
    this.getUsers();
  }

  getBadge = status => {
    return status === 'active'
      ? 'success'
      : status === 'inactive'
      ? 'default'
      : status === 'banned'
      ? 'error'
      : 'primary';
  };

  getUsers = async () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      }
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/users',
        requestOptions
      );

      let userData = await this.handleResponse(response);

      if (this.state.statusFilter !== 'all') {
        userData = userData.filter(
          data => data.status === this.state.statusFilter
        );
      }
      if (this.state.roleFilter !== 'all') {
        userData = userData.filter(data => data.role === this.state.roleFilter);
      }

      userData.forEach((element, index) => {
        const userLink = `/users/${element._id}`;
        // element.name = <Link to={userLink}>{element.name}</Link>;
        // element.email = <Link to={userLink}>{element.email}</Link>;
        let date = new Date(element.date);

        element._id = index + 1;
        element.status = (
          <Link to={userLink}>
            <Badge
              status={this.getBadge(element.status)}
              text={element.status}
            ></Badge>
          </Link>
        );
        element.date = date.toLocaleString();
        element.actions = (
          <div>
            <Button type="primary" to={userLink}>
              <Link to={userLink}>View</Link>
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

  onChangeStatusFilter(e) {
    this.setState({ statusFilter: e.target.value });
    this.getUsers();
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
                      <Radio.Button value="student">Student</Radio.Button>
                      <Radio.Button value="tutor">Tutor</Radio.Button>
                    </Radio.Group>
                    <Radio.Group
                      defaultValue="a"
                      size="small"
                      buttonStyle="solid"
                      onChange={e => this.onChangeStatusFilter(e)}
                      value={this.state.statusFilter}
                    >
                      <Radio.Button value="all">All</Radio.Button>
                      <Radio.Button value="active">Active</Radio.Button>
                      <Radio.Button value="inactive">Inactive</Radio.Button>
                      <Radio.Button value="banned">Banned</Radio.Button>
                    </Radio.Group>
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

export default Users;

/* <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Users{" "}
                  <small className="text-muted">user database</small>
                </CardHeader>
                <CardBody>
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Registered</th>
                        <th scope="col">Role</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.userData.map((user, index) => (
                        <UserRow key={index} index={index} user={user} />
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row> */
