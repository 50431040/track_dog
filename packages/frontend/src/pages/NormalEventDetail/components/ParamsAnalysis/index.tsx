import {
  Button,
  Drawer,
  Message,
  Table,
  TableColumnProps,
} from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { queryCustomParamsInfo } from "../../../../api/normalEvent";
import { useParams } from "react-router-dom";
import useGlobalStore from "../../../../store/useGlobalStore";
import { transformToISOString } from "../../../../utils/format";
import { ICustomParamsInfo } from "../../../../dto/NormalEvent";
import ParamsValueTable from "../ParamsValueTable";

function ParamsAnalysis() {
  const [dataSource, setDataSource] = useState<ICustomParamsInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const eventId = useParams().id;
  const application = useGlobalStore((state) => state.selectedApplication);
  const dateRange = useGlobalStore((state) => state.dateRange);
  const [valueDrawerVisible, setValueDrawerVisible] = useState(false);
  const [paramsName, setParamsName] = useState<string>("");

  const initData = async () => {
    if (!eventId) {
      Message.error("初始化错误");
      return;
    }

    if (!application) {
      Message.error("请先选择应用");
      return;
    }

    setLoading(true);
    const res = await queryCustomParamsInfo({
      eventId,
      appId: application?._id,
      startTime: transformToISOString(dateRange[0]),
      endTime: transformToISOString(dateRange[1]),
    }).finally(() => {
      setLoading(false);
    });
    setDataSource(res);
  };

  const handleDetail = (name: string) => {
    setParamsName(name);
    setValueDrawerVisible(true);
  };

  useEffect(() => {
    initData();
  }, [application, dateRange]);

  const columns: TableColumnProps[] = [
    {
      title: "参数名称",
      dataIndex: "name",
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
      dataIndex: "deviceCountRatio",
    },
    {
      title: "操作",
      render: (_, record) => (
        <Button type="text" onClick={() => handleDetail(record.name)}>
          详情
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table data={dataSource} columns={columns} loading={loading} />
      <Drawer
        width={500}
        title="参数值分布"
        visible={valueDrawerVisible}
        onCancel={() => {
          setValueDrawerVisible(false);
        }}
        footer={null}
      >
        <ParamsValueTable name={paramsName} />
      </Drawer>
    </>
  );
}

export default ParamsAnalysis;
