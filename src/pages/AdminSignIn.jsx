import React from 'react';
import { Form, Input, Button, message, Alert } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../constants';

const AdminSignIn = ({ msg = null }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  console.log(`${backend_url}/admin/signup`)
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
        <h1 style={{ textAlign: 'center' }}>Admin Sign In</h1>
        {msg != null && <Alert type="error" message={msg} banner />}
        <br />
        <Form onFinish={(values) => {
          const key = 'updatable';
          messageApi.loading({ content: 'Signing you in...', key });
          try {
            const form_data = new FormData()
            form_data.append('username', values.username)
            form_data.append('password', values.password)
            form_data.append('email', values.email)
            axios.post(`${backend_url}/admin/signup`, form_data).then((res) => {
              if (res.status === 200) {
                messageApi.success({ content: 'Signup successful!', key, duration: 2 });
                navigate('/');
              } else {
                messageApi.error({ content: 'Signup failed!', key, duration: 2 });
              }
            }).error((err) => {
              messageApi.error({ content: 'Signup failed!', key, duration: 2 });
            });
          } catch (error) {
            messageApi.error({ content: 'Signup failed!', key, duration: 2 });
          }
        }}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username!' }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
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
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AdminSignIn;
