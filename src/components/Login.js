/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import bg01 from '../image/bg01.jpg';

class Login extends React.Component {
  loginRequest = e => {
    e.preventDefault();
    const { login } = this.props;
    login({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    });
  };

  onFailure = error => {
    console.log(error);
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { email, loginErr, getUser, current, logintype } = this.props;
    
    if (email) {
      if (logintype === null) return <Redirect to='/home' />;
      else
          return <Redirect to="/" />;
    }
    if (loginErr === null) getUser();
    return (
      <div
        className="container-login100"
        style={{ backgroundImage: `url(${bg01})` }}
      >
        <div className="wrap-login100">
          <h1 className="login100-form-title">LOGIN</h1>
          <Form onSubmit={this.loginRequest} className="login100-form">
            <p style={{ color: '#fff' }}>{loginErr}</p>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'Please input your email!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="Email"
                  id="email"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="Password"
                  id="password"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true
              })(<Checkbox style={{ color: '#fff' }}>Remember me</Checkbox>)}
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
              
            </Form.Item>
          </Form>
          
        </div>
      </div>
    );
  }
}

const LoginForm = Form.create({})(Login);

export { LoginForm };
export default LoginForm;
