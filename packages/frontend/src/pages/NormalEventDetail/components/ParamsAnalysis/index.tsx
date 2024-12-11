import { Button, Table, TableColumnProps } from "@arco-design/web-react";
import { useState } from "react";

const columns: TableColumnProps[] = [
  {
    title: "参数名称",
    dataIndex: "key",
  },
  {
    title: "总消息数",
    dataIndex: "count",
  },
  {
    title: "发生设备数",
    dataIndex: "deviceCount",
  },
  {
    title: "发生设备数占比",
    dataIndex: "deviceCount",
  },
  {
    title: "操作",
    render: () => <Button type="text">详情</Button>,
  },
];
function ParamsAnalysis() {
  const [dataSource, setDataSource] = useState([]);

  return <Table data={dataSource} columns={columns} />;
}

export default ParamsAnalysis;
