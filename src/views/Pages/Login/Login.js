import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Alert
} from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
      response: null
    };

    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      this.props.history.push('/');
    }
  }

  onChangeHandler(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmitHandler = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    this.login(this.state.email, this.state.password);
  };

  login = async (email, password) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    };
    try {
      const response = await fetch(
        `https://admin-api-tutor.herokuapp.com/user/admin-login`,
        requestOptions
      );

      const userData = await this.handleResponse(response);

      if (userData.token) {
        // localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem('token', JSON.stringify(userData.token));
        const role = userData.user.role;
        localStorage.setItem('role', role);
        this.props.history.push('/');
      }

      this.setState({ loading: false, response: userData });

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
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
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
                      <Form onSubmit={this.onSubmitHandler}>
                        <h1>Login</h1>
                        <p className="text-muted">Sign In to your account</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="email"
                            name="email"
                            placeholder="Username"
                            autoComplete="email"
                            required
                            onChange={this.onChangeHandler}
                          />
                        </InputGroup>
                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="password"
                            name="password"
                            id="passwordInput"
                            required
                            placeholder="Password"
                            autoComplete="current-password"
                            onChange={this.onChangeHandler}
                          />
                        </InputGroup>
                        <Alert
                          id="alert"
                          isOpen={this.state.response}
                          className="mt-2 font-weight-light"
                          color="danger"
                        >
                          {this.state.response
                            ? this.state.response.message
                            : 'hidden'}
                        </Alert>
                        <Row>
                          <Col xs="6">
                            <Button
                              type="submit"
                              color="primary"
                              className="px-4"
                            >
                              Login
                            </Button>
                          </Col>
                          <Col xs="6" className="text-right">
                            <Button color="link" className="px-0">
                              Forgot password?
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </LoadingOverlay>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: '44%' }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua.
                      </p>
                      <Link>
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now!
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
