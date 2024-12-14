import { Message, Table, TableColumnProps } from "@arco-design/web-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGlobalStore from "../../../../store/useGlobalStore";
import { queryCustomParamsValue } from "../../../../api/normalEvent";
import { ICustomParamsValue } from "../../../../dto/NormalEvent";
import { transformToISOString } from "../../../../utils/format";

function ParamsValueTable(props: { name: string }) {
  const [dataSource, setDataSource] = useState<ICustomParamsValue[]>([]);
  const [loading, setLoading] = useState(false);
  const eventId = useParams().id;
  const application = useGlobalStore((state) => state.selectedApplication);
  const dateRange = useGlobalStore((state) => state.dateRange);

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
    const res = await queryCustomParamsValue({
      appId: application?._id,
      eventId: eventId,
      name: props.name,
      startTime: transformToISOString(dateRange[0]),
      endTime: transformToISOString(dateRange[1]),
    }).finally(() => {
      setLoading(false);
    });

    setDataSource(res);
  };

  useEffect(() => {
    initData();
  }, [props.name]);

  const columns: TableColumnProps[] = [
    {
      title: "参数值",
      dataIndex: "value",
    },
    {
      title: "总消息数",
      dataIndex: "count",
    },
    {
      title: "占比",
      dataIndex: "ratio",
    },
  ];
  return <Table data={dataSource} columns={columns} loading={loading} />;
}

export default ParamsValueTable;
