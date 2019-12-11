import React, { Component } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";
import { Badge, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userData: [],
      columns: [
        {
          label: "ID",
          field: "_id",
          sort: "asc",
          width: 50
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
          width: 150
        },
        {
          label: "Email",
          field: "email",
          sort: "asc",
          width: 150
        },
        {
          label: "Registered",
          field: "date",
          sort: "asc",
          width: 100
        },
        {
          label: "Role",
          field: "role",
          sort: "asc",
          width: 100
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
          width: 100
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
          width: 150
        }
      ]
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getBadge = status => {
    return status === "active"
      ? "success"
      : status === "inactive"
      ? "secondary"
      : status === "pending"
      ? "warning"
      : status === "banned"
      ? "danger"
      : "primary";
  };

  getUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI1ZGU1ZTE1YjJkMDY1NjFkNDc2MjA0MmUiLCJyb2xlIjoibWFzdGVyIiwiaWF0IjoxNTc1ODgyNjc1fQ.gRjIyKO6wb0N5QVa5kHuXsWTF7c_GUmNsVkagvNsk2U`
      }
    };
    try {
      const response = await fetch(
        "https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/users",
        requestOptions
      );

      let userData = await this.handleResponse(response);

      userData.forEach((element, index) => {
        const userLink = `/users/${element._id}`;
        // element.name = <Link to={userLink}>{element.name}</Link>;
        // element.email = <Link to={userLink}>{element.email}</Link>;
        let date = new Date(element.date);

        element._id = index + 1;
        element.status = (
          <Link to={userLink}>
            <Badge color={this.getBadge(element.status)}>
              {element.status}
            </Badge>
          </Link>
        );
        element.date = date.toLocaleString();
        element.actions = (
          <div>
            <Link className="btn btn-info" to={userLink}>
              View
            </Link>
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
              background: "rgba(255, 255, 255, 0.5)",
              color: "black"
            }),
            spinner: base => ({
              ...base,
              width: "100px",
              "& svg circle": {
                stroke: "rgba(255, 0, 0, 0.5)"
              }
            })
          }}
        >
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="bg-dark">
                  <i className="fa fa-align-justify"></i>Users{"  "}
                  <small className="text-muted">user database</small>
                </CardHeader>
                <CardBody>
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
