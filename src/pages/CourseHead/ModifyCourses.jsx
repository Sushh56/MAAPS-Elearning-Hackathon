import React, { useEffect } from 'react';
import { Layout, Typography, Row, Col, Card } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BottomStats, NavBar, TitleBar } from '../../components/NavBar';
import { useGlobalState } from '../../hooks/WindowHooks';
import axios from 'axios';
import { backend_url } from '../../constants';
import ViewQuiz from '../../components/ViewQuiz';
import CreateQuiz from '../../components/CreateQuiz';
const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
}

const ModifyCourses = () => {
    const [collapsed, setCollapsed] = useGlobalState();
    const { id } = useParams();
    const [course, setCourse] = useState([]);
    console.log(id)

    useEffect(() => {
        axios.get(`${backend_url}/course/${id}`, auth).then((res) => {
            if (res.status === 200) {
                setCourse(res.data);
            }
        }
        ).catch((err) => {
            console.log(err);
        });
    }, [])

    return (
        <Layout hasSider style={{ minHeight: '100vh', maxHeight: '100vh' }}>
            <Sider width={200} theme="dark" style={{ paddingLeft: '10px', paddingRight: '10px' }} trigger={null} collapsible collapsed={collapsed.closeSidebar}>
                <Title level={3} style={{ color: "white", textAlign: "right", marginRight: "10px" }}>
                    MAAPS<br />E-Learn
                </Title>
                <NavBar />
                <BottomStats />
            </Sider>
            <Layout>
                {TitleBar(collapsed, setCollapsed)}
                <Content style={{ margin: '24px 16px 0 16px', overflowY: 'auto' }}>
                    <div style={{ padding: 24, background: '#fff', }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            background: `url(${course.course_cover})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: "200px",
                            borderRadius: ".25rem",
                            marginBottom: "24px"
                        }}>
                            <div style={{
                                background: "linear-gradient(0deg, rgba(0,0,0,0.0), rgba(0,0,0,0.5))",
                                padding: "24px",
                                borderRadius: ".25rem",
                                color: "white",
                                height: "100%",
                            }}>
                                <h1 level={2} style={{ margin: "0" }}>{course.course_name}</h1><br />
                                <p disabled style={{ margin: "0" }}>{course.course_description}</p>
                            </div>
                        </div>
                        {
                            (JSON.parse(localStorage.getItem('userdata')).access_level === 0) ? <></> : <CreateQuiz />
                        }
                        <ViewQuiz />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};


export default ModifyCourses