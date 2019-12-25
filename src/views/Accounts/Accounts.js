import React, { Component } from 'react';
import { MDBDataTable } from 'mdbreact';
import { Card, CardBody, CardHeader, Col } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Radio, Row, Typography, Button, Tag, Select } from 'antd';
import AddModal from './AddModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

const { Text } = Typography;
const { Option } = Select;

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      loading: true,
      modalVisible: false,
      editModalVisible: false,
      deleteModalVisible: false,
      currentUser: null,
      role: 'admin',
      userData: [],
      modal: null,
      roleFilter: 'all',
      columns: [
        {
          label: 'ID',
          field: 'index',
          sort: 'asc',
          width: 50
        },
        {
          label: 'Picture',
          field: 'profile',
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
          field: 'roleTag',
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
        Authorization: `Bearer ${this.state.token}`
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
        element.index = index + 1;
        element.date = date.toLocaleDateString();
        element.roleTag =
          element.role === 'master' ? (
            <Tag color="magenta">{element.role}</Tag>
          ) : (
            <Tag color="geekblue">{element.role}</Tag>
          );
        element.profile = (
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
              onClick={() => this.toggleEditModal(element)}
              type="primary"
              icon="edit"
            >
              Edit
            </Button>
            <Button
              onClick={() => this.toggleDeleteModal(element)}
              type="danger"
              icon="delete"
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

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      editModalVisible: false,
      deleteModalVisible: false
    });
  };

  handleSubmit = () => {
    this.setState({
      modalVisible: false,
      editModalVisible: false,
      deleteModalVisible: false
    });
    this.getUsers();
  };

  toggleModal() {
    this.setState({ modalVisible: true });
  }

  toggleEditModal(user) {
    this.setState({ editModalVisible: true, currentUser: user });
  }

  toggleDeleteModal(user) {
    this.setState({ deleteModalVisible: true, currentUser: user });
  }

  onSubmit() {
    this.setState({ modalVisible: false });
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
                  <i className="fa fa-align-justify"></i>Accounts{'  '}
                  <small className="text-muted">staff accounts</small>
                </CardHeader>
                <CardBody>
                  <AddModal
                    handleCancel={this.handleCancel}
                    handleSubmit={this.handleSubmit}
                    modalVisible={this.state.modalVisible}
                  ></AddModal>
                  {this.state.editModalVisible ? (
                    <EditModal
                      handleCancel={this.handleCancel}
                      handleSubmit={this.handleSubmit}
                      modalVisible={this.state.editModalVisible}
                      currentUser={this.state.currentUser}
                    ></EditModal>
                  ) : null}
                  {this.state.deleteModalVisible ? (
                    <DeleteModal
                      handleCancel={this.handleCancel}
                      handleSubmit={this.handleSubmit}
                      modalVisible={this.state.deleteModalVisible}
                      currentUser={this.state.currentUser}
                    ></DeleteModal>
                  ) : null}
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
                      type="primary"
                      icon="user-add"
                      style={{
                        backgroundColor: '#00d77d',
                        borderColor: '#00d77d'
                      }}
                      onClick={() => this.toggleModal()}
                    >
                      Create
                    </Button>
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
