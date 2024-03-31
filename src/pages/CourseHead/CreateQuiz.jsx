import React, { useEffect } from 'react';
import { Layout, Typography, Row, Col, Form, Table, Tag, Flex, Input } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BottomStats, NavBar, TitleBar } from '../../components/NavBar';
import { useGlobalState } from '../../hooks/WindowHooks';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { backend_url } from '../../constants';
import axios from 'axios';
import { Button } from 'antd';
import ViewQuiz from '../../components/ViewQuiz';
import { render } from '@testing-library/react';
const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
}

const CreateQuiz = () => {
    const [collapsed, setCollapsed] = useGlobalState();
    const { id } = useParams();
    const [course, setCourse] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectionType, setSelectionType] = useState('checkbox');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const columns = [
        {
            title: 'Question',
            dataIndex: 'question',
            key: 'question',
        },
        {
            title: 'Answer',
            dataIndex: 'answer',
            key: 'answer',
        },
        {
            title: 'Options',
            dataIndex: 'options',
            key: 'options',
            render: (options) => {
                options.forEach(element => {
                    return <Tag>{element}</Tag>
                })
                return <>
                {
                    options.map((option) => {
                        return <Tag>{option}</Tag>
                    })
                }
                </>
            }
        },
    ];
    const [form] = Form.useForm();

    const submitQuiz = () => {
        axios.post(`${backend_url}/course/${id}/quiz`, { data: questions }, auth).then((res) => {
            if (res.status === 200) {
                console.log(res.data);
            }
        }
        ).catch((err) => {
            console.log(err);
        });
    }

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
                            marginBottom: "15px"
                        }}>
                            <div style={{
                                background: "linear-gradient(0deg, rgba(0,0,0,0.0), rgba(0,0,0,0.5))",
                                padding: "24px",
                                borderRadius: ".25rem",
                                color: "white",
                                height: "100%",
                            }}>
                                <h1 level={2} style={{ margin: "0" }}>{course.course_name} - Create Quiz</h1><br />
                                <p disabled style={{ margin: "0" }}>{course.course_description}</p>
                            </div>
                        </div>
                        <br />
                        <br />
                        <Form layout="vertical" form={form} onFinish={(values) => {
                            values.options = values.options.split(',');
                            setQuestions([...questions, values]);
                        }}>
                            <Row gutter={14}>
                                <Col span={6}>
                                    <Form.Item
                                        label="Question"
                                        name="question"
                                        rules={[{ required: true, message: 'Please input your question!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label="Answer"
                                        name="answer"
                                        rules={[{ required: true, message: 'Please input your answer!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item
                                        label="Options"
                                        name="options"
                                        rules={[{ required: true, message: 'Please input your options!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <Button type="primary" htmlType="submit" block>
                                        Add
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            rowSelection={{
                                type: selectionType,
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={questions}
                            rowKey="ledger_uid"
                            bordered
                            title={() => <>
                                <Flex direction="row" justify="space-between">
                                    <div>
                                        <Title level={3} style={{ margin: "0" }}>Added Questions</Title>
                                        <Text type="secondary">Add Questions and Answers here</Text>
                                    </div>
                                    <Flex direction="row" justify='left' align='middle'>

                                    </Flex>
                                </Flex>
                            </>}
                        />
                        <br />
                        <Button onClick={() => submitQuiz()}>
                            Create Quiz
                        </Button>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};


export default CreateQuiz