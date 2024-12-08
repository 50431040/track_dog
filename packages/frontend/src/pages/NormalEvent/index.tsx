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
import { useNavigate } from "react-router-dom";
import { NormalEventType } from "../../enum/normalEvent";

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

  const navigate = useNavigate();

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
    navigate(`/event-detail?eventId=${record._id}`);
  };

  useEffect(() => {
    if (!selectedApplication) {
      Message.warning("请先选择应用");
      return;
    }

    search();
  }, [pagination.current, pagination.pageSize, keyword, selectedApplication]);

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

  return (
    <>
      <Grid.Row justify="start">
        <InputSearch
          searchButton
          placeholder="输入关键字检索"
          style={{ width: 350 }}
          onSearch={onSearch}
        />
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
    </>
  );
}

export default NormalEventPage;
