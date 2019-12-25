import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { Badge, Button, Descriptions, Tag, Timeline } from 'antd';
import { Link } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';
import MessageBox from './MessageBox';

class Contract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      modalVisible: false,
      loading: true,
      banAction: false,
      contractData: [],
      id: null
    };
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.setState({ id });
  }

  componentDidMount = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) this.setState({ token });
    await this.getContract(token);
  };

  getContract = async token => {
    this.setState({ loading: true });
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/contracts/${this.state.id}`,
        requestOptions
      );

      let contractData = await this.handleResponse(response);
      contractData.student.address = Object.values(
        contractData.student.address
      ).join(', ');
      contractData.tutor.address = Object.values(
        contractData.tutor.address
      ).join(', ');
      contractData.student.picture = (
        <img
          src={contractData.student.picture}
          style={{
            height: 200,
            width: 200,
            objectFit: 'cover',
            borderRadius: 125
          }}
          alt="profile"
        />
      );
      contractData.student.status = (
        <Badge
          status={this.getBadge(contractData.student.status)}
          text={contractData.student.status}
        ></Badge>
      );
      contractData.tutor.picture = (
        <img
          src={contractData.tutor.picture}
          style={{
            height: 200,
            width: 200,
            objectFit: 'cover',
            borderRadius: 125
          }}
          alt="profile"
        />
      );
      contractData.tutor.status = (
        <Badge
          status={this.getBadge(contractData.tutor.status)}
          text={contractData.tutor.status}
        ></Badge>
      );
      this.setState({ loading: false, contractData: contractData });
    } catch (err) {
      return err;
    }
  };

  async handleResponse(response) {
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

  getBadge = status => {
    return status === 'active'
      ? 'success'
      : status === 'inactive'
      ? 'default'
      : status === 'banned'
      ? 'error'
      : 'primary';
  };

  getBadge2 = status => {
    return status === 'request'
      ? 'processing'
      : status === 'finished'
      ? 'default'
      : status === 'complain'
      ? 'error'
      : status === 'refund'
      ? 'warning'
      : 'default';
  };

  showMessages() {
    this.setState({ modalVisible: true });
  }

  handleCancel() {
    this.setState({ modalVisible: false });
  }

  refundAction = async () => {
    this.setState({ loading: true });
    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.state.token}`
      }
    };
    try {
      const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/contracts/${this.state.id}/update`,
        requestOptions
      );

      const data = await this.handleResponse(response);
      let contractData = this.state.contractData;
      contractData.contract.currentStatus = data.status;
      this.setState({ loading: false, contractData });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const colors = [
      'magenta',
      'cyan',
      'green',
      'volcano',
      'orange',
      'purple',
      'lime',
      'red',
      'blue',
      'gold',
      'geekblue'
    ];
    let { student, tutor, contract } = this.state.contractData;
    let skills = [];
    let tutorSkills = [];
    let date;
    let statusHistory = [];
    if (student) {
      let count = -1;
      student.skills.map(item => {
        const color = colors[++count % colors.length];
        const skillTag = <Tag color={color}>{item}</Tag>;
        skills.push(skillTag);
      });
    }
    if (tutor) {
      let count = -1;
      tutor.skills.map(item => {
        const color = colors[++count % colors.length];
        const skillTag = <Tag color={color}>{item}</Tag>;
        tutorSkills.push(skillTag);
      });
    }
    if (!student) {
      student = { id: 'Not found' };
    }
    if (!tutor) {
      tutor = { id: 'Not found' };
    }
    if (!contract) {
      contract = { id: 'Not found' };
    } else {
      date = new Date(contract.contractCreationDate);
      date = date.toLocaleDateString();
      statusHistory = contract.statusHistory;
    }

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
            <Col lg={12}>
              <Card>
                <CardHeader className="bg-dark">
                  <strong>
                    <i className="icon-info pr-1"></i>Contract ID:{' '}
                    {this.props.match.params.id}
                  </strong>
                </CardHeader>
                <CardBody>
                  <div
                    style={{ border: 'solid 1px grey', paddingBottom: '20px' }}
                  >
                    <Row className="justify-content-end m-4">
                      <Button
                        onClick={() => this.refundAction()}
                        disabled={
                          contract.currentStatus === 'complain' ||
                          contract.currentStatus === 'refund'
                            ? false
                            : true
                        }
                        type={
                          contract.currentStatus === 'complain'
                            ? 'danger'
                            : 'primary'
                        }
                      >
                        {contract.currentStatus === 'complain'
                          ? 'Refund'
                          : 'Undo'}
                      </Button>
                    </Row>
                    <Row className="justify-content-center mt-4">
                      <h1 className="text-uppercase font-weight-bold">
                        Contract
                      </h1>
                    </Row>
                    <Row className="justify-content-center mb-4">
                      <h5 className="">
                        status:{' '}
                        {contract ? (
                          <Badge
                            status={this.getBadge2(contract.currentStatus)}
                            text={contract.currentStatus}
                          ></Badge>
                        ) : null}
                      </h5>
                    </Row>
                    <Row className="justify-content-end mb-4">
                      <h4 style={{ paddingRight: '100px' }}>
                        {contract ? date : null}
                      </h4>
                    </Row>
                    <Row
                      className="justify-content-center"
                      style={{ paddingLeft: '40px' }}
                    >
                      <Col className="mt-4 mb-4 justify-content-center" lg={10}>
                        <Descriptions title="Contract Info">
                          <Descriptions.Item label="Show">
                            <Button onClick={() => this.showMessages()}>
                              Messages
                            </Button>
                            {this.state.modalVisible ? (
                              <MessageBox
                                messages={this.state.contractData.messages}
                                visible={this.state.modalVisible}
                                handleCancel={() => this.handleCancel()}
                                student={contract.studentID}
                                tutor={contract.tutorID}
                              ></MessageBox>
                            ) : null}
                          </Descriptions.Item>
                          <Descriptions.Item label="Student">
                            <Link
                              to={
                                contract ? `/users/${contract.studentID}` : null
                              }
                            >
                              {contract ? contract.studentName : null}
                            </Link>
                          </Descriptions.Item>
                          <Descriptions.Item label="Tutor">
                            <Link
                              to={
                                contract ? `/users/${contract.tutorID}` : null
                              }
                            >
                              {contract ? contract.tutorName : null}
                            </Link>{' '}
                          </Descriptions.Item>
                          <Descriptions.Item label="Created">
                            {contract ? date : null}
                          </Descriptions.Item>
                          <Descriptions.Item label="Skill">
                            {contract ? contract.skill : null}
                          </Descriptions.Item>
                          <Descriptions.Item label="Price">
                            {contract ? contract.price + ' VND' : null}
                          </Descriptions.Item>
                          <Descriptions.Item label="Status">
                            {contract ? (
                              <Badge
                                status={this.getBadge2(contract.currentStatus)}
                                text={contract.currentStatus}
                              ></Badge>
                            ) : null}
                          </Descriptions.Item>
                          <Descriptions.Item label="History">
                            <Timeline>
                              {statusHistory.map(item => {
                                return (
                                  <Timeline.Item>
                                    [{new Date(item.date).toLocaleDateString()}]
                                    {' - '}
                                    {item.content}
                                  </Timeline.Item>
                                );
                              })}
                            </Timeline>
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>
                    <div style={{ padding: '50px' }}>
                      <Row className="pa-4 justify-content-center">
                        <Col lg={3} className=" mt-4">
                          <Row className="justify-content-center font-weight-bold mb-3">
                            <h2 className="text-uppercase name-font">
                              {student.name}
                            </h2>
                          </Row>
                          <Row className="justify-content-center">
                            {student.picture}
                          </Row>
                        </Col>
                        <Col className="ml-4 mt-4" lg={8}>
                          <Descriptions
                            title="Student Information"
                            bordered
                            column={{
                              xxl: 4,
                              xl: 3,
                              lg: 3,
                              md: 3,
                              sm: 2,
                              xs: 1
                            }}
                          >
                            <Descriptions.Item label="Role">
                              {student.role}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                              {student.status}
                            </Descriptions.Item>
                            <Descriptions.Item label="Registered">
                              {new Date(student.date).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Info">
                              <strong>Email: </strong>
                              <br />{' '}
                              <span className="ml-4 mb-2">{student.email}</span>
                              <br />
                              <strong>Address: </strong>
                              <br />{' '}
                              <span className="ml-4 mb-2">
                                {student.address}
                              </span>
                              <br /> <strong>Skills: </strong>
                              <br /> <span className="ml-4 mb-2">{skills}</span>
                              <br />
                              <strong>Introduction: </strong>
                              <br />
                              <span className="ml-4 mb-2">
                                {student.introduction}
                              </span>
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                      </Row>
                      <Row
                        className="pa-4 justify-content-center"
                        style={{ paddingTop: '40px' }}
                      >
                        <Col className="mr-4 mt-4" lg={8}>
                          <Descriptions
                            title="Tutor Information"
                            bordered
                            column={{
                              xxl: 4,
                              xl: 3,
                              lg: 3,
                              md: 3,
                              sm: 2,
                              xs: 1
                            }}
                          >
                            <Descriptions.Item label="Role">
                              {tutor.role}
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                              {tutor.status}
                            </Descriptions.Item>
                            <Descriptions.Item label="Registered">
                              {new Date(tutor.date).toLocaleString()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Info">
                              <strong>Email: </strong>
                              <br />{' '}
                              <span className="ml-4 mb-2">{tutor.email}</span>
                              <br />
                              <strong>Address: </strong>
                              <br />{' '}
                              <span className="ml-4 mb-2">{tutor.address}</span>
                              <br /> <strong>Skills: </strong>
                              <br />{' '}
                              <span className="ml-4 mb-2">{tutorSkills}</span>
                              <br />
                              <strong>Introduction: </strong>
                              <br />
                              <span className="ml-4 mb-2">
                                {tutor.introduction}
                              </span>
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                        <Col lg={3} className=" mt-4">
                          <Row className="justify-content-center font-weight-bold mb-3">
                            <h2 className="text-uppercase name-font">
                              {tutor.name}
                            </h2>
                          </Row>
                          <Row className="justify-content-center">
                            {tutor.picture}
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Contract;
