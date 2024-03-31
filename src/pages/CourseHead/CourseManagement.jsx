import React, { useEffect } from 'react';
import { Layout, Typography, Space, Tag, Avatar, Table, Badge, Button, Flex, Popconfirm, Drawer, Form, Col, Row, Input, Select, DatePicker } from 'antd';
import { useState } from 'react';
import axios from 'axios';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import { render } from '@testing-library/react';
import { useGlobalState } from '../../hooks/WindowHooks';
import { NavBar, TitleBar } from '../../components/NavBar';
import { backend_url } from '../../constants';
const { Option } = Select;
const { Sider, Content } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'withCredentials': true
    },
}

const CourseManagementRedirect = () => {
    return (
        <Button type="primary" href="/manage/users">Manage Courses</Button>
    );
}

const CourseManagement = () => {
    const [selectionType, setSelectionType] = useState('checkbox');
    const [refresh, triggerRefresh] = useState(false);
    const [collapsed, setCollapsed] = useGlobalState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [data, setData] = useState([])

    const columns = [
        {
            title: 'Name',
            dataIndex: 'course_name',
            render: (text, record) =>
                <Space>
                    {
                        (record.course_cover != null) ?
                            <Badge dot="true" color='red'>
                                <Avatar src={record.course_cover} />
                            </Badge> : <Avatar icon={<UserOutlined />} />
                    }
                    <span style={{ marginRight: '16px' }}>{text}</span>
                </Space>
            ,
        },
        {
            title: 'Description',
            dataIndex: 'course_description',
            render: (text) => {
                if (text === null || text === "") {
                    return <Text disabled><i>No Information</i></Text>
                }
                return text;
            }
        },
    ];

    const deleteCourses = async () => {
        for (let i = 0; i < selectedRowKeys.length; i++) {
            await axios.delete(`${backend_url}/course/${selectedRowKeys[i]}`, auth).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        }
        updateCourses();
    }

    const updateCourses = async () => {
        axios.get(`${backend_url}/courses`, auth).then((response) => {
            if (response.data.length === 0) {
                setData([]);
            } else {
                setData(response.data);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        updateCourses();
    }, [refresh]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    return (
        <Layout style={{ minHeight: '100vh', maxHeight: '100vh' }}>
            <Sider width={200} theme="dark" style={{ paddingLeft: '10px', paddingRight: '10px' }} trigger={null} collapsible collapsed={collapsed.closeSidebar}>
                <Title level={3} style={{ color: "white", textAlign: "right", marginRight: "10px" }}>
                    MAAPS<br />E-Learn
                </Title>
                <NavBar />
            </Sider>
            <Layout>
                {TitleBar(collapsed, setCollapsed)}
                <Content style={{ margin: '24px 16px 0 16px', overflowY: 'auto' }}>
                    <div style={{ padding: 24, background: '#fff', }}>
                        <Table
                            rowSelection={{
                                type: selectionType,
                                ...rowSelection,
                            }}
                            columns={columns}
                            dataSource={data}
                            rowKey="course_id"
                            bordered
                            title={() => <>
                                <Flex direction="row" justify="space-between">
                                    <div>
                                        <Title level={3} style={{ margin: "0" }}>Manage Courses</Title>
                                        <Text type="secondary">Manage Courses and Enrolements</Text>
                                    </div>
                                    <Flex direction="row" justify='left' align='middle'>
                                        {AddCourses(refresh, triggerRefresh)}
                                        &nbsp;
                                        <Popconfirm
                                            title="Delete selected users?"
                                            description="Are you sure to delete the selected users?"
                                            onConfirm={() => { deleteCourses() }}
                                            onCancel={() => { }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button danger>Delete</Button>
                                        </Popconfirm>
                                    </Flex>
                                </Flex>
                            </>}
                        />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

const AddCourses = (refresh, triggerRefresh) => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const { jsx } = AddCoursesSideDrawer(open, onClose, refresh, triggerRefresh);

    return (
        <>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                Add Courses
            </Button>
            {jsx}
        </>
    );
};

const AddCoursesSideDrawer = (open, onClose, refresh, triggerRefresh) => {
    const [form] = Form.useForm();
    const [options, setOptions] = useState([]);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => {
                return (
                    <Flex align='center'>
                        {(record.photo_url != null) ? <Avatar src={record.photo_url} /> : <Avatar icon={<UserOutlined />} />}
                        <div>
                            &nbsp;&nbsp;&nbsp;
                        </div>
                        <div style={{ flexDirection: "column", display: "flex" }}>
                            <p style={{ margin: "0" }}>{text}</p>
                            <p style={{ margin: "0" }}>{record.email}</p>
                        </div>
                    </Flex>
                )
            },
        },
        {
            title: 'Actions',
            dataIndex: 'name',
            render: (text, record) => {
                return (
                    <Space>
                        <Popconfirm
                            title="Delete this user?"
                            description="Are you sure to delete this user?"
                            onConfirm={() => {
                                let newData = data.filter((user) => {
                                    return user.uid !== record.uid;
                                });
                                setData(newData);
                            }}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    </Space>
                )
            }
        },
    ];
    const [data, setData] = useState([]);

    const debounce = (func, delay) => {
        let debounceTimer
        return function () {
            const context = this
            const args = arguments
            clearTimeout(debounceTimer)
            debounceTimer
                = setTimeout(() => func.apply(context, args), delay)
        }
    }

    const handleSearch = (value) => {
        axios.get(`${backend_url}/admin/user/search?query=${value}`, auth).then((res) => {
            const data = res.data;
            const options = data.map(d => ({
                "value": d.uid,
                "props": d,
                "label": <Space>
                    {
                        (d.photo_url != null && d.user_photo_url == null) ?
                            <Badge dot="true" color='red'>
                                <Avatar src={d.photo_url} />
                            </Badge> : <></>
                    }
                    {
                        (d.photo_url == null && d.user_photo_url != null) ?
                            <Badge dot="true" color='green'>
                                <Avatar src={d.user_photo_url} />
                            </Badge> : <Avatar icon={<UserOutlined />} />
                    }
                    <span>{d.username}</span>
                </Space>
            }));
            if (options.length === 0) {
                options.push({
                    "value": value,
                    "props": undefined,
                    "label": <Space>
                        <Avatar icon={<UserOutlined />} />
                        <span>{value}</span>
                        <Text disabled type="secondary">New Contact</Text>
                    </Space>
                });
            }
            setOptions(options);
        }).catch((err) => {
            console.log(err);
        });
        let res = [];

        setOptions(res);
    };

    const filterOption = (input, option) => {
        let list = []
        if (option.props === undefined) {
            list.push(option.label);
            return list;
        }
        for (let i = 0; i < options.length; i++) {
            if (options[i].props.username === input) {
                list.push(options[i].label);
            } else if (options[i].props.username.toLowerCase().includes(input.toLowerCase())) {
                list.push(options[i].label);
            }
        }
        return list;
    }

    const addUser = (e) => {
        let user = options.filter((option) => {
            return option.value === e;
        })
        console.log(user)
        setData([...data, user[0].props]);
    }

    return {
        jsx: <Drawer
            title="Create a new course"
            width={720}
            onClose={onClose}
            open={open}
            styles={{
                body: {
                    paddingBottom: 80,
                },
            }}
            extra={
                <Space>
                    <Button onClick={() => {
                        form.resetFields();
                        if (typeof triggerRefresh === 'function') {
                            triggerRefresh(!refresh);
                        }
                        onClose();
                    }}>Cancel</Button>
                    <Button onClick={() => {
                        form.submit();
                    }} type="primary">
                        Submit
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" form={form} onFinish={(values) => {
                const enrolements = data.map((user) => {
                    return user.uid;
                });
                values.enrolements = enrolements;
                axios.post(`${backend_url}/course`, values, auth).then((response) => {
                    if (typeof triggerRefresh === 'function') {
                        triggerRefresh(!refresh);
                    }
                    // form.resetFields();
                    
                    // onClose();
                }).catch((error) => {
                    console.log(error.response.data);
                });
            }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter user name',
                                },
                            ]}
                        >
                            <Input placeholder="Please enter user name" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please have a description'
                                }
                            ]}
                        >
                            <TextArea placeholder="Please enter user description" rows={4} />
                        </Form.Item>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    title={() =>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Title level={4} style={{ margin: 0 }}>Add Users</Title>

                            </Col>
                            <Col span={16}>
                                <Select
                                    onSearch={(e) => { debounce(handleSearch(e), 500) }}
                                    showSearch
                                    filterOption={filterOption}
                                    onChange={(e) => {
                                        addUser(e);
                                    }}
                                    style={{width: "100%"}}
                                    placeholder="Aditi Rao"
                                    options={options}
                                />
                            </Col>
                        </Row>}
                    footer={() => 'Footer'}
                />
            </Form>
        </Drawer>,
        setName: (e) => {
            form.setFieldsValue({
                name: e
            });
        }
    };
}

export { CourseManagementRedirect, CourseManagement, AddCoursesSideDrawer };