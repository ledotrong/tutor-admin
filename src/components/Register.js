import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button, Modal, Tag, Tooltip, Icon, Radio } from 'antd';
import * as callApi from '../utils/apiCaller';
import bg01 from '../image/bg01.jpg';
import {Link } from 'react-router-dom';
const callback = function() {};
const expiredCallback = function() {};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      autoCompleteResult: [],
      tags: [],
    inputVisible: false,
    inputValue: '',
    role: null
    };
  }
  registerRequest = e => {
    e.preventDefault();
    const user = {
      email: document.getElementById('email').value,
      name: document.getElementById('name').value,
      password: document.getElementById('password').value,
      address: document.getElementById('address').value,
      role: "admin"
    };
      return callApi
        .callApiRegister(user)
        .catch(err => {
          console.log(err);
          document.getElementById('msg').innerHTML = err.response.data;
        });
  
  };
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleWebsiteChange = value => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(
        domain => `${value}${domain}`
      );
    }
    this.setState({ autoCompleteResult });
  };

  changeDirect() {
    if (localStorage.getItem('usertoken') === null)
      this.props.history.push('/login');
    else this.props.history.push('/');
  }

  success() {
    Modal.success({
      title: 'Create Account Success',
      content: 'Press OK to login',
      onOk: () => {
        this.changeDirect();
      }
    });
  }
  handleClose = removedTag => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log(tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });
  };
  saveInputRef = input => (this.input = input);
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tags, inputVisible, inputValue } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 16,
          offset: 8
        }
      }
    };

    return (
      <div
        className="container-login100"
        style={{ backgroundImage: `url(${bg01})` }}
      >
        <div className="wrap-register100">
          <h1 className="login100-form-title">REGISTER</h1>
          <div className="register100-form">
 
        <div>
        {(
             <Form {...formItemLayout}>
             <p id="msg" style={{ color: 'red' }} />
             <Form.Item label="Email">
               {getFieldDecorator('email', {
                 rules: [
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!'
                      },
                   { required: true, message: 'Please input your email!' }
                 ]
               })(<Input id="email" />)}
             </Form.Item>

              <Form.Item label="Name">
               {getFieldDecorator('name', {
                 rules: [
                    {
                      required: true,
                      message: 'Input name'
                    }
                 ]
               })(<Input id="name" />)}
             </Form.Item>

             <Form.Item label="Address">
               {getFieldDecorator('address', {
                 rules: [
                    {
                      required: true,
                      message: 'Input address'
                    }
                 ]
               })(<Input id="adress" />)}
             </Form.Item>

             <Form.Item label="Password" hasFeedback>
               {getFieldDecorator('password', {
                 rules: [
                   {
                     required: true,
                     message: 'Please input your password!'
                   },
                   {
                     validator: this.validateToNextPassword
                   }
                 ]
               })(<Input.Password id="password" />)}
             </Form.Item>
             <Form.Item label="Confirm Password" hasFeedback>
               {getFieldDecorator('confirm', {
                 rules: [
                   {
                     required: true,
                     message: 'Please confirm your password!'
                   },
                   {
                     validator: this.compareToFirstPassword
                   }
                 ]
               })(<Input.Password onBlur={this.handleConfirmBlur} />)}
             </Form.Item>
             
           </Form>
          )}
       <Button type="primary" onClick={this.registerRequest}>
              Sign up
            </Button> 
          
        </div>

          </div>
        </div>
      </div>
    );
  }
}
const RegisterForm = Form.create({})(Register);

export { RegisterForm };
export default withRouter(RegisterForm);
