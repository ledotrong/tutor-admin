import { Modal, Tag } from 'antd';
import React, { Component } from 'react';

class MessageBox extends React.Component {
  state = { visible: false };

  componentDidMount() {
    console.log(this.props.messages);
  }

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  render() {
    let messages = [];
    if (this.props.messages) messages = this.props.messages;
    return (
      <div>
        <Modal
          title="Messages"
          visible={this.props.visible}
          onOk={this.props.handleCancel}
          onCancel={this.props.handleCancel}
        >
          <div style={{ height: '400px', overflow: 'scroll' }}>
            {messages.message
              ? messages.message.map(item => {
                  return (
                    <div
                      className={`m-4 ${
                        item.author === this.props.student
                          ? 'justify-content-start'
                          : 'justify-content-end'
                      } d-flex`}
                    >
                      <div>
                        <div style={{ fontSize: '12px' }}>
                          {item.author === this.props.student
                            ? 'student'
                            : 'tutor'}
                        </div>
                        <Tag
                          style={{ padding: '5px', fontSize: '14px' }}
                          color={
                            item.author === this.props.student
                              ? '#00d77d'
                              : '#e052cf'
                          }
                        >
                          {item.data.text} {item.data.emoji}
                        </Tag>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
        </Modal>
      </div>
    );
  }
}

export default MessageBox;
