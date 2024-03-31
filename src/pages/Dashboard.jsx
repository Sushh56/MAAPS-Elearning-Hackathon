import React from 'react';
import { Layout, Typography, Row, Col, Card } from 'antd';
import { useState } from 'react';
import { BottomStats, NavBar, TitleBar } from '../components/NavBar';
import { useGlobalState } from '../hooks/WindowHooks';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'; 
import { CourseManagement } from './CourseHead/CourseManagement';
import CourseHeadDashboard from './CourseHead/CourseHeadDashboard';
import UserDashboard from './User/UserDashboard';
const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
}

const Dashboard = () => {
    const [collapsed, setCollapsed] = useGlobalState();
    console.log(collapsed, setCollapsed)
    return (
        <Layout hasSider style={{ minHeight: '100vh', maxHeight: '100vh' }}>
            <Sider width={200} theme="dark" style={{ paddingLeft: '10px', paddingRight: '10px' }} trigger={null} collapsible collapsed={collapsed.closeSidebar}>
                <Title level={3} style={{ color: "white", textAlign: "right", marginRight: "10px" }}>
                    MAAPS<br/>E-Learn
                </Title>
                <NavBar />
                <BottomStats />
            </Sider>
            <Layout>
                {TitleBar(collapsed, setCollapsed)}
                <Content style={{ margin: '24px 16px 0 16px', overflowY: 'auto' }}>
                    <div style={{ padding: 24, background: '#fff', }}>
                        {
                            
                            (localStorage.getItem('userdata') !== null && JSON.parse(localStorage.getItem('userdata')).access_level=== 1) ? <CourseHeadDashboard /> : <UserDashboard />
                        }
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};


export default Dashboard