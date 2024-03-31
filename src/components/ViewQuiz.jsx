import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from '../constants';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';

const auth = {
    headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
    },
}

const ViewQuiz = () => {
    const [quiz, setQuiz] = useState([])
    const { id } = useParams();
    useEffect(() => {
        axios.get(`${backend_url}/course/${id}/quiz`, auth)
        .then(res => {
            console.log(res.data)
            setQuiz(
                res.data.map((quiz) => {
                    return (
                        <div key={quiz.quiz_id} style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                            <h1>{quiz.quiz_id}</h1>
                            <p>{new Date(quiz.created_at).toLocaleString()}</p>
                            <div>
                                <Button type="primary" style={{marginRight: "10px"}}
                                onClick={() => {
                                    window.location.href = `/manage/courses/${id}/quiz/${quiz.quiz_id}`
                                }}
                                >Attend Quiz</Button>
                            </div>
                        </div>
                    )
                })
            
            )
        })
        .catch(err => {
            console.log(err)
        })
    }, [])    

    return <>
        {quiz}
    </>
}

export default ViewQuiz;