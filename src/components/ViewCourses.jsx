import { useEffect, useState } from "react";
import axios from 'axios';
import { backend_url } from "../constants";
import { Image, Card, Typography } from 'antd';
const { Text, Link } = Typography;

const ViewCourses = () => {

    const auth = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    }
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        axios.get(`${backend_url}/courses`, auth).then((res) => {
            if (res.status === 200) {
                setCourses(res.data);
            }
        }).catch((err) => {
            console.log(err);
        });
    }, [])


    return (
        <div style={{display: "flex", flexWrap: "wrap"}}>
            {courses.map((course) => {
                return (
                    <a href={`/manage/courses/${course.course_id}`} key={course.course_id}>
                        <Card
                            cover={<img alt="example" src={course.course_cover} />}
                            bordered={false}
                            style={{
                                width: 300,
                                margin: "10px"
                            }}
                        >
                            <Text level={3} style={{ margin: "0" }}>{course.course_name}</Text><br />
                            <Text disabled style={{ margin: "0" }}>{course.course_description}</Text>
                        </Card>
                    </a>
                )
            })}
        </div>
    )
}

export default ViewCourses;