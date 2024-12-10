import {
  Button,
  Divider,
  Grid,
  Input,
  Message,
  PaginationProps,
  Table,
  TableColumnProps,
} from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { queryNormalEventList } from "../../api/normalEvent";
import { INormalEvent } from "../../dto/NormalEvent";
import useGlobalStore from "../../store/useGlobalStore";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { NormalEventType } from "../../enum/normalEvent";
import dayjs from "dayjs";

const InputSearch = Input.Search;
function NormalEventPage() {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<INormalEvent[]>([]);
  const [keyword, setKeyword] = useState("");
  const selectedApplication = useGlobalStore(
    (state) => state.selectedApplication,
  );
  const dateRange = useGlobalStore((state) => state.dateRange);

  const navigate = useNavigate();
  const location = useLocation();

  const onSearch = (value: string) => {
    setKeyword(value);
    setPagination({ ...pagination, current: 1 });
  };

  const search = async () => {
    setLoading(true);
    const res = await queryNormalEventList({
      appId: selectedApplication!._id,
      page: pagination.current!,
      pageSize: pagination.pageSize!,
      keyword,
      startTime: new Date(
        dayjs(dateRange[0]).format("YYYY-MM-DD 00:00:00"),
      ).toISOString(),
      endTime: new Date(
        dayjs(dateRange[1]).add(1, "day").format("YYYY-MM-DD 00:00:00"),
      ).toISOString(),
    }).finally(() => {
      setLoading(false);
    });
    setData(res.list);
    setPagination({ ...pagination, total: res.total });
  };

  const onChange = (pagination: PaginationProps) => {
    setPagination(pagination);
  };

  const handleDetail = (record: INormalEvent) => {
    // 跳转事件详情页面 TODO
    navigate(`/normal-event/detail/${record._id}`);
  };

  useEffect(() => {
    if (!selectedApplication) {
      Message.warning("请先选择应用");
      return;
    }

    search();
  }, [
    pagination.current,
    pagination.pageSize,
    keyword,
    selectedApplication,
    dateRange,
  ]);

  useEffect(() => {
    setPagination({ ...pagination, current: 1 });
  }, [selectedApplication]);

  const columns: TableColumnProps[] = [
    { title: "事件名称", dataIndex: "name" },
    {
      title: "事件类型",
      dataIndex: "type",
      render: (_, record) =>
        NormalEventType[record.type as keyof typeof NormalEventType],
    },
    { title: "事件数", dataIndex: "count" },
    { title: "事件达成设备数", dataIndex: "deviceCount" },
    {
      title: "明细",
      width: 150,
      align: "center",
      render: (_, record: INormalEvent) => (
        <Button type="text" onClick={() => handleDetail(record)}>
          详情
        </Button>
      ),
    },
  ];

  // 如果当前路径包含 detail，说明是详情页面，只渲染 Outlet
  if (location.pathname.includes("/normal-event/detail/")) {
    return <Outlet />;
  }

  // 原有的列表页面内容
  return (
    <>
      <Grid.Row justify="start" style={{ marginBottom: "12px" }}>
        <InputSearch
          searchButton
          placeholder="输入关键字检索"
          style={{ width: 350 }}
          onSearch={onSearch}
        />
      </Grid.Row>
      <Table
        columns={columns}
        showHeader
        border={false}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
        data={data}
        onChange={onChange}
      />
    </>
  );
}

export default NormalEventPage;
