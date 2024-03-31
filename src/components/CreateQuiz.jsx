import React from 'react';
import { Card, Button, Flex } from 'antd';

const CreateQuiz = () => {
    return (
        <Flex style={{display: "flex"}}>
            <Card
                title="Create Quiz"
                style={{
                    width: "100%"
                }}
            > 
                <p>
                    Create a quiz for your students to take
                </p>
                <Button type="primary"
                    onClick={() => {
                        window.location.href = `${window.location.href}/quiz`
                    }}
                >Create Quiz</Button>
            </Card>
            <Card
                title="Create Quiz"
                style={{
                    width: "100%"
                }}
            >
                <p>
                    Create a quiz for your students to take
                </p>
                <Button type="primary"
                    onClick={() => {
                        window.location.href = `${window.location.href}/quiz`
                    }}
                >Create Quiz</Button>
            </Card>
        </Flex>
    );
}

export default CreateQuiz;