import {
  PaginationProps,
  Table,
  TableColumnProps,
  Image,
  Tag,
  Grid,
  Button,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  Message,
} from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { createApplication, queryApplicationList } from "../../api/application";
import { IApplication } from "../../dto/Application";
import dayjs from "dayjs";
import { Platform } from "@/enum/platform";
console.log(Platform);

const columns: TableColumnProps[] = [
  {
    title: "应用名称",
    dataIndex: "name",
  },
  {
    title: "图标",
    dataIndex: "icon",
    render: (value) =>
      value ? <Image src={value} alt="icon" width={20} height={20} /> : "-",
  },
  {
    title: "平台",
    dataIndex: "platform",
    render: (value) => <Tag>{Platform[value as keyof typeof Platform]}</Tag>,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    render: (value) =>
      value ? <div>{dayjs(value).format("YYYY-MM-DD HH:mm:ss")}</div> : "",
  },
];

const formRules = {
  name: [
    { required: true, message: "请输入应用名称" },
    { maxLength: 32, message: "最大长度为32" },
  ],
  icon: [{ maxLength: 1000, message: "最大长度为1000" }],
  platform: [{ required: true, message: "请选择应用平台" }],
};

function ApplicationManager() {
  const [data, setData] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onChange = (pagination: PaginationProps) => {
    setPagination(pagination);
  };

  const search = async () => {
    setLoading(true);
    const res = await queryApplicationList({
      page: pagination.current,
      pageSize: pagination.pageSize,
    }).finally(() => {
      setLoading(false);
    });

    setData(res.list);
    setPagination({
      ...pagination,
      total: res.total,
    });
  };

  const onAddApplication = () => {
    setAddModalVisible(true);
  };

  const onConfirmAddApplication = () => {
    form.validate().then((values) => {
      createApplication(values).then(() => {
        form.resetFields();
        setAddModalVisible(false);
        search();
        Message.success("添加成功");
      });
    });
  };

  useEffect(() => {
    search();
  }, [pagination.current, pagination.pageSize]);

  return (
    <>
      <Grid.Row justify="end">
        <Button type="primary" onClick={onAddApplication}>
          添加
        </Button>
      </Grid.Row>
      <Divider />
      <Table
        columns={columns}
        showHeader
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        data={data}
        onChange={onChange}
      />
      <Modal
        title="添加应用"
        maskClosable={false}
        visible={addModalVisible}
        onOk={onConfirmAddApplication}
        onCancel={() => setAddModalVisible(false)}
      >
        <Form form={form}>
          <Form.Item label="应用名称" field="name" rules={formRules.name}>
            <Input />
          </Form.Item>
          <Form.Item label="应用图标" field="icon" rules={formRules.icon}>
            <Input />
          </Form.Item>
          <Form.Item label="平台" field="platform" rules={formRules.platform}>
            <Select>
              {Object.keys(Platform).map((platform) => (
                <Select.Option key={platform} value={platform}>
                  {Platform[platform as keyof typeof Platform]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ApplicationManager;
