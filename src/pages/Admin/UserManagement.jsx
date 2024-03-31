import React, { useEffect } from 'react';
import { Layout, Typography, Space, Tag, Avatar, Table,Badge, Button, Flex, Popconfirm, Drawer, Form, Col, Row, Input, Select, DatePicker } from 'antd';
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

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'withCredentials': true
    },
}

const UserManagementRedirect = () => {
    return (
        <Button type="primary" href="/manage/users">Manage Users</Button>
    );
}

const UserManagement = () => {
    const [selectionType, setSelectionType] = useState('checkbox');
    const [refresh, triggerRefresh] = useState(false);
    const [collapsed, setCollapsed] = useGlobalState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [data, setData] = useState([])
    const columns = [
        {
            title: 'Name',
            dataIndex: 'username',
            render: (text, record) =>
                <Space>
                    {
                        (record.photo_url != null) ? 
                        <Badge dot="true" color='red'>
                            <Avatar src={record.photo_url} />
                        </Badge> : <Avatar icon={<UserOutlined />} />
                    }
                    <span style={{ marginRight: '16px' }}>{text}</span>
                </Space>
            ,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            render: (text) => {
                if (text === null || text === "") {
                    return <Text disabled><i>No Information</i></Text>
                }
                return text;
            }
        },
        {
            title: 'Access Level',
            dataIndex: 'access_level',
            render: (text) => {
                if (text === null) {
                    return <Text disabled><i>No Information</i></Text>
                }
                switch (text) {
                    case 0:
                        return <Tag color="green">User</Tag>
                    case 1:
                        return <Tag color="blue">Course Head</Tag>
                    case 2:
                        return <Tag color="red">Admin</Tag>
                    default:
                        break;
                }
            }
        },
        {
            title: 'Date Joined',
            dataIndex: 'created_at',
            render: (text, record) => {
                if (text === null) {
                    return <Text disabled><i>No Information</i></Text>
                }
                return <>
                    {new Date(text).toLocaleString()} &nbsp;
                    {(record.verification_status === 0) ? <Tag color="red">Unverified</Tag> : <Tag color="green">Verified</Tag>}
                </>;
            }
        },
    ];

    const deleteUsers = async () => {
        for (let i = 0; i < selectedRowKeys.length; i++) {
            await axios.delete(`${backend_url}/admin/user/${selectedRowKeys[i]}`, auth).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
        }
        updateUsers();
    }

    const updateUsers = async () => {
        axios.get(`${backend_url}/admin/user`, auth).then((response) => {
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
        updateUsers();
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
                    MAAPS<br/>E-Learn
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
                            rowKey="uid"
                            bordered
                            title={() => <>
                                <Flex direction="row" justify="space-between">
                                    <div>
                                        <Title level={3} style={{ margin: "0" }}>Manage Users and Course Heads</Title>
                                        <Text type="secondary">Manage users and course heads and modify access privilages</Text>
                                    </div>
                                    <Flex direction="row" justify='left' align='middle'>
                                        {AddUsers(refresh, triggerRefresh)}
                                        &nbsp;
                                        <Popconfirm
                                            title="Delete selected users?"
                                            description="Are you sure to delete the selected users?"
                                            onConfirm={() => { deleteUsers() }}
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

const AddUsers = (refresh, triggerRefresh) => {
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    const { jsx } = AddUsersSideDrawer(open, onClose, refresh, triggerRefresh);

    return (
        <>
            <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                Add Users
            </Button>
            {jsx}
        </>
    );
};

const AddUsersSideDrawer = (open, onClose, refresh, triggerRefresh) => {
    const [form] = Form.useForm();

    return {
        jsx: <Drawer
                title="Create a new account"
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
                    axios.post(`${backend_url}/admin/user`, values, auth).then((response) => {
                        console.log(response.data)
                        if (typeof triggerRefresh === 'function') {
                            triggerRefresh(!refresh);
                        }
                        form.resetFields();
                        onClose();
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
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email ID"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Please enter valid email ID'
                                    }
                                ]}
                            >
                                <Input placeholder="aurora@nuvie.in" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="is_user"
                                label="Access Level"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select access level'
                                    }
                                ]}
                            >
                                <Select placeholder="Please select access level">
                                    <Option value="user">User</Option>
                                    <Option value="course_head">Course Head</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>,
            setName: (e) => {
                form.setFieldsValue({
                    name: e
                });
            }
    };
}

export { UserManagementRedirect, UserManagement, AddUsersSideDrawer };