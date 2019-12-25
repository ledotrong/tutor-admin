import React, { Component } from 'react';
import { Col } from 'reactstrap';
import LoadingOverlay from 'react-loading-overlay';
import { Card, Row, Typography, Radio, Statistic, Select } from 'antd';
import {
  Chart,
  Tooltip,
  Axis,
  Point,
  SmoothLine,
  Legend,
  Sector,
  Coord
} from 'viser-react';

const { Text } = Typography;
const { Option } = Select;

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      revenue: [],
      loading: false,
      rangeFilter: 'all'
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
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) this.setState({ token });
    this.getRevenue();
  }

  handleResponse(response) {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        return false;
      }
      return data;
    });
  }

  getRevenue = async () => {
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
        'https://cors-anywhere.herokuapp.com/https://admin-api-tutor.herokuapp.com/me/revenue',
        requestOptions
      );

      let revenue = await this.handleResponse(response);
      this.setState({ loading: false, revenue: revenue });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  };

  onChangeFilter(e) {
    this.setState({ rangeFilter: e.target.value });
  }

  render() {
    let data = [];
    let sum = 0;
    const skills = [
      { skill: 'ReactJS', revenue: 41.8 },
      { skill: 'Angular', revenue: 38 },
      { skill: 'React Native', revenue: 33.7 },
      { skill: 'VueJS', revenue: 30.7 },
      { skill: 'C#', revenue: 25.8 },
      { skill: '.NET', revenue: 31.7 },
      { skill: 'Unity', revenue: 33 },
      { skill: 'English', revenue: 46 },
      { skill: 'Guitar', revenue: 38.3 }
    ];
    if (this.state.revenue.length) {
      const revenue = this.state.revenue;
      revenue.forEach((item, index) => {
        data.push({ contract: (index + 1).toString(), value: item.price });
        sum = sum + item.price;
      });
    }

    const scale = [
      {
        dataKey: 'value'
      },
      {
        dataKey: 'contract'
      }
    ];

    return (
      <div className="animated fadeIn mt-4">
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
          <Card title="Dashboard" bordered={false}>
            <Row type="flex" justify="center" className="mt-4">
              <Col xl={5}>
                <h3>Statistic</h3>
                <Row>
                  <Row type="flex" justify="start">
                    <Statistic
                      title="Revenue (VND)"
                      value={sum}
                      precision={0}
                    />
                    <Statistic
                      title="Contracts"
                      value={data.length}
                      precision={0}
                      className="ml-4"
                    />
                  </Row>
                  <h6 className="mt-4" style={{ color: 'grey' }}>
                    Top Revenue per Skill
                  </h6>
                  <Chart forceFit height={350} data={skills}>
                    <Tooltip />
                    <Legend position="bottom" dataKey="skill" offsetX={0} />
                    <Coord type="polar" />
                    <Sector
                      position="skill*revenue"
                      color="skill"
                      style={{ stroke: '#fff', lineWidth: 1 }}
                    />
                  </Chart>
                </Row>
              </Col>
              <Col xl={6}>
                <Radio.Group
                  className="d-flex justify-content-end mb-2"
                  defaultValue="a"
                  size="small"
                  buttonStyle="solid"
                  onChange={e => this.onChangeFilter(e)}
                  value={this.state.rangeFilter}
                >
                  <Radio.Button value="all">All</Radio.Button>
                  <Radio.Button value="week">Week</Radio.Button>
                  <Radio.Button value="month">Month</Radio.Button>
                </Radio.Group>
                <Card title="Revenue" bordered={true}>
                  <Chart forceFit height={400} data={data} scale={scale}>
                    <Tooltip />
                    <Axis />
                    <SmoothLine color="#00d77d" position="contract*value" />
                    <Point
                      color="#00d77d"
                      position="contract*value"
                      shape="circle"
                    />
                  </Chart>
                </Card>
              </Col>
            </Row>
          </Card>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Dashboard;
