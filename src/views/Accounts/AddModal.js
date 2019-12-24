import React, { Component } from 'react';
import {
  message,
  Upload,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Icon
} from 'antd';
import { storage } from '../../helpers/Firebase';
import firebase from '../../helpers/Firebase';

const { Option } = Select;
message.config({
  top: 70
});

class AddModal extends Component {
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
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) this.setState({ token });
  }

  onChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onRoleChange(role) {
    this.setState({ role });
  }

  beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
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

  handleUpload(info) {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageURL =>
        this.setState({
          imageURL,
          imageFile: info.file.originFileObj,
          loading: false
        })
      );
    }
  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  async onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });

    const { imageFile } = this.state;
    if (imageFile) {
      const uploadImage = storage
        .ref(`images/${imageFile.name}`)
        .put(imageFile);
      uploadImage.on(
        'state_changed',
        () => {
          // console.log(snapshot);
        },
        error => {
          console.log(error);
        },
        async () => {
          const imageURL = await storage
            .ref('images')
            .child(imageFile.name)
            .getDownloadURL();
          this.setState({ picture: imageURL });
          this.sendRequest(imageURL);
        }
      );
    } else this.sendRequest(null);
  }

  async sendRequest(image) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        address: this.state.address,
        role: this.state.role,
        picture: image ? image : undefined
      })
    };
    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/user/register',
        requestOptions
      );

      let data = await this.handleResponse(response);
      if (data.newUser) {
        message.success('Account created successfully');
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <div>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Modal
            title="Create New Account"
            visible={modalVisible}
            onOk={() => this.onSubmit()}
            onCancel={this.props.handleCancel}
            footer={[
              <Button onClick={this.props.handleCancel}>Cancel</Button>,
              <Button
                key="Submit"
                loading={this.state.loading}
                type="primary"
                onClick={this.onSubmit}
              >
                Submit
              </Button>
            ]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader d-flex justify-content-center mb-2"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={this.beforeUpload}
              onChange={this.handleUpload}
            >
              {this.state.imageURL ? (
                <img
                  src={this.state.imageURL}
                  alt="avatar"
                  style={{ width: '100%' }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
            <Form.Item label="Name">
              <Input
                name="name"
                required
                placeholder="your full name"
                onChange={this.onChangeHandler}
              />
            </Form.Item>
            <Form.Item label="E-mail">
              <Input
                name="email"
                required
                placeholder="example@email"
                onChange={this.onChangeHandler}
              />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password
                name="password"
                placeholder="at least 6 characters"
                onChange={this.onChangeHandler}
              />
            </Form.Item>
            <Form.Item label="Address">
              <Input
                name="address"
                required
                placeholder="Eg: 123 Street, Ward,..."
                onChange={this.onChangeHandler}
              />
            </Form.Item>
            <Form.Item label="Role">
              <Select
                value={this.state.role}
                size={this.props.size}
                style={{ width: '32%' }}
                onChange={value => this.onRoleChange(value)}
              >
                <Option value="admin">Admin</Option>
                <Option value="master">Master</Option>
              </Select>
            </Form.Item>
          </Modal>
        </Form>
      </div>
    );
  }
}

export default AddModal;
