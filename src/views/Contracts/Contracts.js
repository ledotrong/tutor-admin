import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Radio, Row, Typography, Button, Badge } from 'antd';

const { Text } = Typography;

class Contracts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      loading: true,
      contractData: [],
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
          label: 'Student',
          field: 'studentName',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Tutor',
          field: 'tutorName',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Created',
          field: 'contractCreationDate',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Status',
          field: 'currentStatus',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Skill',
          field: 'skill',
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
    return status === 'request'
      ? 'success'
      : status === 'finished'
      ? 'default'
      : status === 'complain'
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
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/contracts',
        requestOptions
      );

      let contractData = await this.handleResponse(response);

      if (this.state.statusFilter !== 'all') {
        contractData = contractData.filter(
          data => data.currentStatus === this.state.statusFilter
        );
      }
      if (this.state.roleFilter !== 'all') {
        contractData = contractData.filter(
          data => data.role === this.state.roleFilter
        );
      }

      contractData.forEach((element, index) => {
        const userLink = `/contracts/${element._id}`;
        // element.name = <Link to={userLink}>{element.name}</Link>;
        // element.email = <Link to={userLink}>{element.email}</Link>;
        let date = new Date(element.contractCreationDate);

        element._id = index + 1;
        element.currentStatus = (
          <Link to={userLink}>
            <Badge
              status={this.getBadge(element.currentStatus)}
              text={element.currentStatus}
            ></Badge>
          </Link>
        );
        element.contractCreationDate = date.toLocaleString();
        element.actions = (
          <div>
            <Button type="primary" to={userLink}>
              <Link to={userLink}>View</Link>
            </Button>
          </div>
        );
      });

      this.setState({ loading: false, contractData: contractData });
      return contractData;
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
    //this.onFilterOut();
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
                  <i className="fa fa-align-justify"></i>Contracts{'  '}
                  <small className="text-muted">list</small>
                </CardHeader>
                <CardBody>
                  <Row className="mt-2" type="flex" justify="end">
                    <Radio.Group
                      defaultValue="a"
                      size="small"
                      buttonStyle="solid"
                      onChange={e => this.onChangeStatusFilter(e)}
                      value={this.state.statusFilter}
                    >
                      <Radio.Button value="all">All</Radio.Button>
                      <Radio.Button value="request">Requesting</Radio.Button>
                      <Radio.Button value="finished">Finished</Radio.Button>
                      <Radio.Button value="complain">Complained</Radio.Button>
                    </Radio.Group>
                  </Row>
                  <MDBDataTable
                    responsive
                    hover
                    bordered
                    data={{
                      columns: this.state.columns,
                      rows: this.state.contractData
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

export default Contracts;
