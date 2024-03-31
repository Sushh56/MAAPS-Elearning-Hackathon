import React from 'react';
import { Layout, Typography, Row, Col, Card } from 'antd';
import { useState } from 'react';
import { BottomStats, NavBar, TitleBar } from '../../components/NavBar';
import { useGlobalState } from '../../hooks/WindowHooks';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'; 
import ViewCourses from '../../components/ViewCourses';
const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
}

const UserDashboard = () => {
    const [collapsed, setCollapsed] = useGlobalState();
    console.log(collapsed, setCollapsed)
    return (
        <Content>
            <div style={{ padding: 24, background: '#fff', }}>
                <Row>
                    <Col span={24}>
                        <Card title="Courses" extra={<PlusOutlined />}>
                            <ViewCourses />
                        </Card>
                    </Col>
                </Row>
            </div>
        </Content>
    );
};


export default UserDashboard