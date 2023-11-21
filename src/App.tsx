import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/header';
import { SaveTodo, Todo } from './shared/todo';
import { TaskModelUtil } from './shared/task-model-utill';
import { Button, Form, Input, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

function App() {
  const [todos, setTodos] = useState<Array<Todo>>([]);
  let [taskCount, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [taskId, setTaskId] = useState<number>(0);

  const refreshUIwhenAddTask = () => {
    setCount(taskCount + 1); 
  }

  useEffect(()=>{
    fetchTodos().then((data)=> {
      setTodos(data);
    });  
  },[taskCount]);

  const handleDelete = (id?: number) => {
    deleteTodo(id).then((res) => {
      if (res) {
        setCount(taskCount - 1);
      }
    });
  }

  const showModal = (id: number) => {
    setTaskId(id);
    getCurrentTodo(id);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onUpdate = (values: any) => {
    const todo: SaveTodo = {
      name: values.name,
      description: values.description,
    }
    updateTodo(taskId, todo).then(()=>{
      console.log("updated");
      form.resetFields();
      setCount(taskCount + 1);
      setIsModalOpen(false);
    });
  };

  async function getCurrentTodo(id: number) {
    await getTodoById(id)
    .then((data) => {
      form.setFieldValue("name", data.name);
      form.setFieldValue("description", data.description);
    });
  }

  const columns: ColumnsType<Todo> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date & Time',
      dataIndex: 'datetime',
      key: 'datetime'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Todo) => (
        <Space size="middle">
          {/* <a>Invite {record.name}</a> */}
          <Button type="primary" onClick={() => showModal(record.id)} block>Update</Button>
          <Button type="primary" onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="App">
      <Header onClick={refreshUIwhenAddTask}></Header>
      <Table columns={columns} dataSource={todos} />
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
            onFinish={onUpdate}
          >
            <Form.Item label="Name of task" name="name"  rules={[{ required: true }]}>
              <Input/>
            </Form.Item>

            <Form.Item label="Description of task" name="description" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Form>
      </Modal>
    </div>
  );
}

const getTodoById = (id: number): Promise<Todo> => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  return new Promise((resolve, reject) => {
    const url = process.env.REACT_API_BASE_URL || "";
    fetch(`http://localhost:5195/api/task/${id}`, options)
      .then((response) => response.json())
      .then((data) => {
        resolve(TaskModelUtil.mapRawTodoToTodo(data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
}

const fetchTodos = (): Promise<any> => {  
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  return new Promise((resolve, reject) => {
    const url = process.env.REACT_API_BASE_URL || "";
    fetch("http://localhost:5195/api/task", options)
      .then((response) => response.json())
      .then((data) => {        
        resolve(TaskModelUtil.mapRawTodosToTodos(data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        reject(error);
      });
  });
};

const updateTodo = (id: number, todo: SaveTodo): Promise<any> => {  
  const options = {
    method: "PUT",
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
    fetch(`http://localhost:5195/api/task/${id}`, options)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error saving data:", error);
        reject(error);
      });
  });
};

const deleteTodo = (id?: number): Promise<boolean> => {
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  };

  return new Promise((resolve, reject) => {
    fetch(`http://localhost:5195/api/task/${id}`, options)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        reject(false);
      });
  });
}

export default App;
