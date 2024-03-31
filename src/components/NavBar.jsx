import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined, MenuUnfoldOutlined, MenuFoldOutlined, ContactsOutlined, ShareAltOutlined, FundOutlined, DatabaseOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, Avatar,Layout, Button, Typography, Space } from 'antd';
import { useGlobalState } from '../hooks/WindowHooks';
const { Header, Sider, Content } = Layout;

const NavBar = () => {
    const NavBarItems = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Dashboard',
            link: '/dashboard',
        },
    ]

    let access_level = JSON.parse(localStorage.getItem('userdata')).access_level;
    console.log(JSON.parse(localStorage.getItem('userdata')))
    if (access_level === 1) {
        NavBarItems.push({
            key: '2',
            icon: <ContactsOutlined />,
            label: 'Courses',
            link: '/courses',
            children: [
                {
                    key: '2.1',
                    label: 'Course Management',
                    link: '/manage/courses',
                    icons: <UserOutlined />
                }
            ]
        })
    } else if (access_level === 2) {
        NavBarItems.push({
            key: '2',
            icon: <ContactsOutlined />,
            label: 'Users',
            link: '/users',
            children: [
                {
                    key: '2.1',
                    label: 'User Management',
                    link: '/manage/user',
                    icons: <UserOutlined />
                },
                {
                    key: '2.2',
                    label: 'Course Head Management',
                    link: '/manage/courses',
                    icons: <UserOutlined />
                }
            ]
        })
    }
    
    const x = useLocation().pathname;
    let curr_index = null;
    for (let i = 0; i < NavBarItems.length; i++) {
        if (NavBarItems[i].link === x) {
            curr_index = [NavBarItems[i].key];
            break;
        }
        if (NavBarItems[i].children) {
            for (let j = 0; j < NavBarItems[i].children.length; j++) {
                if (NavBarItems[i].children[j].link === x) {
                    curr_index = [NavBarItems[i].children[j].key];
                    break;
                }
            }
        }
    }
    
    let arr = []
        for (let i = 0; i < NavBarItems.length; i++) {
            if (NavBarItems[i].children) {
                arr.push(
                    <Menu.SubMenu key={NavBarItems[i].key} icon={NavBarItems[i].icon} title={NavBarItems[i].label}>
                        {NavBarItems[i].children.map((item, index) => {
                            return (
                                <Menu.Item key={item.key} icon={item.icons}>
                                    <Link to={item.link}>{item.label}</Link>
                                </Menu.Item>
                            )
                        })}
                    </Menu.SubMenu>
                )
            } else {
                arr.push(
                    <Menu.Item key={NavBarItems[i].key} icon={NavBarItems[i].icon}>
                        <Link to={NavBarItems[i].link}>{NavBarItems[i].label}</Link>
                    </Menu.Item>
                )
            }
        }

    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={curr_index}>
            {arr}
            <Space></Space>
        </Menu>
    )
}

const TitleBar = (collapsed, setCollapsed, textOverride) => {
    const userData = JSON.parse(localStorage.getItem('userdata'));
    const userName = userData.username;
    const userImage = userData.photo_url;
    const x = useLocation().pathname;
    const url = {
        "/dashboard": "Dashboard",
        "/manage/user": "User Management",
    }
    return (
        <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {setCollapsed(collapsed.closeSidebar = !collapsed.closeSidebar); console.log(collapsed)}}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <Typography.Title level={3} style={{ margin: 0 }}>
                {(textOverride === null || textOverride === undefined) ? url[x] : textOverride}
            </Typography.Title>
            <Space style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '16px', alignItems: 'center' }}>
                {
                    (userImage != null) ? <Avatar src={userImage} /> : <Avatar icon={<UserOutlined />} />
                }
                <span style={{ marginRight: '16px' }}>Welcome, {userName}</span>
            </Space>
        </Header>
    )
} 

const BottomStats = () => {
    const [collapsed, setCollapsed] = useGlobalState();

    return (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', color: 'white', display: (collapsed ? 'none' : 'initial')}}>
            <div style={{backgroundColor: "#1677ff", padding: "10px", borderRadius: ".60rem", color: "white"}}>
                <Typography.Text style={{ color: 'white' }}>Total Balance</Typography.Text>
                <Typography.Title style={{ color: 'white' }} level={3}>$ 0.00</Typography.Title>
            </div>
            <br />
            <Typography.Text style={{ color: 'white' }}>V0.0.6 BETA</Typography.Text>
        </div>
    )
}

export { NavBar, TitleBar, BottomStats };