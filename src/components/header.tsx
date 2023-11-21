import styled from "styled-components"
import { Form, Input, Modal } from 'antd';
import { useState } from "react";
import { SaveTodo, Todo } from "../shared/todo";



interface HeaderProps {
  onClick: () => void;
}

const Header = ({ onClick }: HeaderProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
      setIsModalOpen(true);
    };

    const onFinish = (values: any) => {
      console.log(values);
      const todo: SaveTodo = {
        name: values.name,
        description: values.description,
      }
      saveTodo(todo).then(()=>{
        console.log("saved");
        onClick();
        form.resetFields();
        setIsModalOpen(false);
      });
      
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    return (
        <>
            <HeadDiv>
                <button onClick={showModal}>Add Task</button>
            </HeadDiv>
            <Modal title="Basic Modal" open={isModalOpen} onOk={form.submit} onCancel={handleCancel}>
                <Form
                  form={form}
                  name="wrap"
                  labelCol={{ flex: '110px' }}
                  labelAlign="left"
                  labelWrap
                  wrapperCol={{ flex: 1 }}
                  colon={false}
                  style={{ maxWidth: 600 }}
                  onFinish={onFinish}
                >
                  <Form.Item label="Name of task" name="name"  rules={[{ required: true }]}>
                    <Input/>
                  </Form.Item>

                  <Form.Item label="Description of task" name="description" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Header;

const saveTodo = (todo: SaveTodo): Promise<any> => {  
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body : JSON.stringify({
      name: todo.name,
      description: todo.description,
    }),
  };

  return new Promise((resolve, reject) => {
    //const url = process.env.REACT_API_BASE_URL || "";
    fetch("http://localhost:5195/api/task", options)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        reject(error);
      });
  });
};

const HeadDiv = styled.div`
    background-color: red;
    height: 4rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 4rem;

    button {
        width: 5rem;
        height: 2rem;  
        background-color: white;
        border: none;
        border-radius: 2rem;      
    }
`;