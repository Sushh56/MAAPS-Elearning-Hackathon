import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from '../constants';

const ViewQuizes = () => {
    const [quiz, setQuiz] = useState([])
    useEffect(() => {
        axios.get(`${backend_url}/quizes/`)
        .then(res => {
            setQuiz(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    })    

    return <>
        {quiz}
    </>
}

export default ViewQuizes;