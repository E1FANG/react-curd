import { useEffect, useState } from "react";
import "./App.css";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/api/user";
import { Table, Input, Button, Modal, Form } from "antd";
import { User } from "./types/user";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

const { Search } = Input;

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [keyWord, setKeyWord] = useState("");

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const columns: ColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <>
            <Button
              onClick={() => {
                toEdit(record);
              }}
            >
              edit
            </Button>
            <Button
              onClick={() => {
                toDel(record);
              }}
            >
              delete
            </Button>
          </>
        );
      },
    },
  ];

  const getData = async () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    const { data, total } = await getAllUsers({
      pageNum: current || 1,
      pageSize: pageSize || 10,
      keyWord,
    });
    setTotal(total);
    setUsers(data);
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, [pagination.current, pagination.pageSize, keyWord]);

  const onSearch = (value: string) => {
    setKeyWord(value);
    setPagination({
      ...pagination,
      current: 1,
    });
  };
  const onChange = (pagination: TablePaginationConfig) => {
    setPagination({
      ...pagination,
    });
    getData();
  };

  // add user
  const [currentId, setCurrentId] = useState<undefined | number>();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onOk = () => {
    form.submit();
  };
  const onFinish = async () => {
    const { name, desc } = form.getFieldsValue();
    const fetchMethod = currentId ? updateUser : createUser;
    await fetchMethod({
      id: currentId || undefined,
      name,
      desc,
    });
    onCancel();
    getData();
  };

  const toCreate = () => {
    form.resetFields();
    setIsModalOpen(true);
    setCurrentId(undefined);
  };
  const toEdit = (record: User) => {
    console.log(record);
    form.setFieldsValue(record);
    setCurrentId(record.id);
    setIsModalOpen(true);
  };

  const toDel = async (record: User) => {
    console.log(record);
    await deleteUser(record.id);
    getData();
  };

  return (
    <>
      <Button onClick={toCreate}>create</Button>
      <Search allowClear onSearch={onSearch} />
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey={(record) => record.id}
        onChange={(pagination) => {
          onChange(pagination);
        }}
        pagination={{
          total: total,
          pageSize: pagination.pageSize,
          current: pagination.current,
        }}
      ></Table>
      <Modal
        open={isModalOpen}
        onCancel={onCancel}
        onOk={onOk}
        title={currentId ? "Edit" : "Create"}
      >
        <Form labelCol={{ span: 6 }} form={form} onFinish={onFinish}>
          <Form.Item<User> label="Name" name="name">
            <Input />
          </Form.Item>

          <Form.Item<User> label="Description" name="desc">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default App;
