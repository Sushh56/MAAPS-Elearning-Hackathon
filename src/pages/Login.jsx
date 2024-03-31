import React from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../constants';

const LoginForm = ({ msg = null }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    const key = 'updatable';
    messageApi.loading({ content: 'Logging you in...', key });
    try {
      const form_data = new FormData()
      form_data.append('email', values.email)
      form_data.append('password', values.password)
      axios.post(`${backend_url}/auth/login`, form_data).then((res) => {
        if (res.status === 200) {
          localStorage.removeItem('userdata');
          localStorage.removeItem('token');
          localStorage.setItem('userdata', JSON.stringify(res.data.userdata));
          localStorage.setItem('token', res.data.token);
          messageApi.success({ content: 'Login successful!', key, duration: 2 });
          navigate('/dashboard');
        } else {
          messageApi.error({ content: 'Login failed!', key, duration: 2 });
        }
      }).error((err) => {
        messageApi.error({ content: 'Login failed!', key, duration: 2 });
      });
    } catch (error) {
      messageApi.error({ content: 'Login failed!', key, duration: 2 });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url('https://source.unsplash.com/random/1920x1080?landscape')`,
        backgroundSize: 'cover',
      }}
    >
      {contextHolder}
      <div style={{ width: '300px', padding: '20px', borderRadius: '.75rem', background: '#fff' }}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
        {msg != null && <Alert type="error" message={msg} banner />}
        <br />
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
