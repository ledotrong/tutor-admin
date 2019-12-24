import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import { MDBDataTable, MDBTable } from 'mdbreact';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Alert,
  Form
} from 'reactstrap';

class Skills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      deleteModal: false,
      editModal: false,
      addModal: false,
      name: '',
      link: '',
      key: '',
      skills: [],
      loading: true,
      currentItem: null,
      token: null,
      alert: null
    };

    this.toggleDelete = this.toggleDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleAdd = this.toggleAdd.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
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
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) this.setState({ token });
    this.getSkills();
  }

  setFormat(skills) {
    skills.forEach((element, index) => {
      element.id = index + 1;
      element.isDeleted = undefined;
      element.actions = (
        <div className="float-right">
          <Button
            className="mr-2"
            onClick={() => this.toggleEditItem(element)}
            type="primary"
            icon="edit"
            style={{
              backgroundColor: '#00C5D7',
              borderColor: '#00C5D7',
              color: 'white'
            }}
          >
            Edit
          </Button>
          <Button
            icon="delete"
            onClick={() => this.toggleDeleteItem(element)}
            type="danger"
            style={{
              backgroundColor: '#d71200',
              borderColor: '#d71200',
              color: 'white'
            }}
          >
            Delete
          </Button>
        </div>
      );
    });
  }

  getSkills = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      }
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/skills',
        requestOptions
      );

      let skills = await this.handleResponse(response);
      skills = skills.filter(data => data.isDeleted !== true);

      this.setFormat(skills);

      this.setState({ loading: false, skills: skills });
    } catch (err) {
      console.log(err);
    }
  };

  handleResponse(response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        return false;
      }
      return data;
    });
  }

  onChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  toggleDelete() {
    this.setState({
      deleteModal: !this.state.deleteModal
    });
  }

  toggleDeleteItem(item) {
    this.toggleDelete();
    this.setState({ currentItem: item });
  }

  toggleEdit() {
    this.setState({
      editModal: !this.state.editModal
    });
  }

  toggleEditItem(item) {
    this.toggleEdit();
    this.setState({ currentItem: item });
  }

  toggleAdd() {
    this.setState({
      addModal: !this.state.addModal,
      alert: null
    });
  }

  async onCreate(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({ name: this.state.name })
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/skill',
        requestOptions
      );

      let skills = await this.handleResponse(response);

      if (skills) {
        this.getSkills();
        this.setState({
          addModal: false,
          alert: null
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async onEdit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    console.log('Update');
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        name: this.state.name,
        key: this.state.currentItem._id
      })
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/skill/update',
        requestOptions
      );

      let skills = await this.handleResponse(response);
      if (skills) {
        this.getSkills();
        this.setState({
          editModal: false,
          alert: null
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async onDelete(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        key: this.state.currentItem._id
      })
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/skill/delete',
        requestOptions
      );

      let skills = await this.handleResponse(response);
      if (skills) {
        this.getSkills();
        this.setState({
          deleteModal: false,
          alert: null
        });
      }
    } catch (err) {
      console.log(err);
    }
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
          <Row className="justify-content-center">
            <Col xs="6" lg="8">
              <Card>
                <CardHeader className="bg-dark">
                  <i className="fa fa-align-justify"></i>Skills
                </CardHeader>

                <CardBody>
                  <Button
                    onClick={this.toggleAdd}
                    type="primary"
                    className="mb-3 float-right"
                    icon="plus-circle"
                    style={{
                      backgroundColor: '#00d77d',
                      borderColor: '#00d77d',
                      color: 'white'
                    }}
                  >
                    Add
                  </Button>

                  <MDBDataTable
                    responsive
                    hover
                    bordered
                    data={{
                      columns: [
                        {
                          label: 'ID',
                          field: 'id',
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
                          label: 'Actions',
                          field: 'actions',
                          sort: 'asc',
                          width: 100
                        }
                      ],
                      rows: this.state.skills
                    }}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
            isOpen={this.state.addModal}
            toggleDelete={this.toggleAdd}
            className={'modal-success '}
          >
            <ModalHeader>Add</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onCreate}>
                <Input
                  type="text"
                  id="text-input"
                  name="name"
                  placeholder="Name"
                  required
                  className="mb-2"
                  onChange={this.onChangeHandler}
                />
                {this.state.alert}
                <Button
                  className="float-right"
                  color="success"
                  type="submit"
                  onSubmit={this.onCreate}
                >
                  Add
                </Button>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleAdd}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <Modal
            isOpen={this.state.editModal}
            toggleDelete={this.toggleEdit}
            className={'modal-info '}
          >
            <ModalHeader>Edit</ModalHeader>
            <ModalBody>
              <Form onSubmit={this.onEdit}>
                <Input
                  type="text"
                  id="edit-name"
                  name="key"
                  placeholder="key"
                  required
                  disabled
                  value={
                    this.state.currentItem ? this.state.currentItem._id : ''
                  }
                  className="mb-2"
                  onChange={this.onChangeHandler}
                />
                <Input
                  type="text"
                  id="edit-link"
                  name="name"
                  placeholder="Name"
                  required
                  className="mb-2"
                  onChange={this.onChangeHandler}
                />
                <Button
                  className="float-right"
                  color="info"
                  type="submit"
                  onSubmit={this.onEdit}
                >
                  Update
                </Button>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleEdit}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <Modal
            isOpen={this.state.deleteModal}
            toggleDelete={this.toggleDelete}
            className={'modal-danger '}
          >
            <ModalHeader>Delete</ModalHeader>
            <ModalBody>
              This skill will be marked as 'deleted'. Do you want to continue?
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.onDelete}>
                Confirm
              </Button>{' '}
              <Button color="secondary" onClick={this.toggleDelete}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Skills;
