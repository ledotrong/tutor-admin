import React, { Component } from 'react';
import { message, Button, Modal, Form } from 'antd';

class DeleteModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      loading: false,
      role: 'admin',
      name: '',
      email: '',
      imageFile: null,
      imageURL: null,
      picture: null,
      address: '',
      password: ''
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem('token'));
    const currentUser = this.props.currentUser;
    if (token) this.setState({ token });

    this.setState({
      name: currentUser.name,
      email: currentUser.email,
      address: currentUser.address,
      role: currentUser.role
    });
  }

  onChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleResponse(response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        return data;
      }
      return data;
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    const requestOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        _id: this.props.currentUser._id
      })
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/deleteUser',
        requestOptions
      );
      let data = await this.handleResponse(response);
      if (data.deleted) {
        message.success('Account deleted successfully');
        this.props.handleSubmit();
      } else message.error(data);

      this.setState({ loading: false });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const modalVisible = this.props.modalVisible;
    const formItemLayout = {
      labelCol: {
        xs: { span: 18 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 28 },
        sm: { span: 17 }
      }
    };

    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Modal
            title={`Edit user with ID: ${
              this.props.currentUser ? this.props.currentUser._id : null
            }`}
            visible={modalVisible}
            onOk={() => this.onSubmit()}
            onCancel={this.props.handleCancel}
            footer={[
              <Button onClick={this.props.handleCancel}>Cancel</Button>,
              <Button
                key="Submit"
                loading={this.state.loading}
                type="danger"
                onClick={this.onSubmit}
              >
                Delete
              </Button>
            ]}
          >
            <p>
              Are you sure to delete this account? (ID:{' '}
              {this.props.currentUser ? this.props.currentUser._id : null})
            </p>
          </Modal>
        </Form>
      </div>
    );
  }
}

export default DeleteModal;
