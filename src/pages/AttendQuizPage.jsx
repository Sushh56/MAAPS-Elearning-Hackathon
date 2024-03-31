import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from '../constants';
import React from 'react';
import { Layout, Typography, Row, Col, Card, Radio } from 'antd';
import { useParams } from 'react-router-dom';
import { BottomStats, NavBar, TitleBar } from "../components/NavBar";
import { useGlobalState } from "../hooks/WindowHooks";
const { Text, Title } = Typography;
const { Sider, Content } = Layout;

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
}

const AttendQuizPage = () => {  
    const [collapsed, setCollapsed] = useGlobalState();
    const [course, setCourses] = useState([]);
    const {id, qid} = useParams();
    const [quiz, setQuiz] = useState([]);

    useEffect(() => {
        axios.get(`${backend_url}/course/${id}`, auth).then((res) => {
            if (res.status === 200) {
                setCourses(res.data);
            }
        }
        ).catch((err) => {
            console.log(err);
        });
        axios.get(`${backend_url}/course/${id}/quiz/${qid}`, auth).then((res) => {
            if (res.status === 200) {
                let quiz = res.data[0].quiz;
                quiz = quiz.replace(/'/g, '"');
                console.log(quiz);
                setQuiz(JSON.parse(quiz));
                console.log(quiz);
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
                    MAAPS<br/>E-Learn
                </Title>
                <NavBar />
                <BottomStats />
            </Sider>
            <Layout>
                {TitleBar(collapsed, setCollapsed, "Attend Quiz")}
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
                                <h1 level={2} style={{ margin: "0" }}>{course.course_name} / {qid}</h1><br />
                                <p disabled style={{ margin: "0" }}>{course.course_description}</p>
                            </div>
                        </div>
                        <br />
                        {
                            (quiz.length != 0)? 
                            quiz.map((question) => {
                                return (
                                    <Card title={question.question} style={{ marginBottom: "15px" }}>
                                        <Radio.Group>
      
                                            {question.options.map((option) => {
                                                console.log(option)
                                                return <Radio value={`${option}`}>{option}</Radio>
                                            })}
                                        </Radio.Group>
                                        </Card>
                                )
                            })
                            : <></>
                        }
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default AttendQuizPage;