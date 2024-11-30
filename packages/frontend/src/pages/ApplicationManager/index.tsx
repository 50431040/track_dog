import {
  PaginationProps,
  Table,
  TableColumnProps,
} from "@arco-design/web-react";
import { SorterInfo } from "@arco-design/web-react/es/Table/interface";
import { useState } from "react";

const columns: TableColumnProps[] = [
  {
    title: "应用名称",
    dataIndex: "name",
  },
  {
    title: "图标",
    dataIndex: "icon",
  },
  {
    title: "平台",
    dataIndex: "platform",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
];

function ApplicationManager() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const onChange = (
    pagination: PaginationProps,
    sorter: SorterInfo | SorterInfo[],
  ) => {
    console.log(pagination, sorter);
  };

  return (
    <Table
      columns={columns}
      loading={loading}
      pagination={pagination}
      data={data}
      onChange={onChange}
    />
  );
}

export default ApplicationManager;
