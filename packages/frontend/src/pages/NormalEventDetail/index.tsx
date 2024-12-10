import { Message, Tabs } from "@arco-design/web-react";
import { useParams } from "react-router-dom";
import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { queryNormalEventTrend } from "../../api/normalEvent";
import useGlobalStore from "../../store/useGlobalStore";
import dayjs from "dayjs";

const TabPane = Tabs.TabPane;

function NormalEventDetailPage() {
  const id = useParams().id;

  const application = useGlobalStore((state) => state.selectedApplication);
  const dateRange = useGlobalStore((state) => state.dateRange);

  const trendChartRef = useRef<echarts.ECharts>();
  console.log(id);

  const initTrendChart = () => {
    if (!id) {
      Message.error("初始化错误");
      return;
    }

    if (!application) {
      Message.error("请先选择应用");
      return;
    }

    trendChartRef.current!.showLoading();
    queryNormalEventTrend({
      appId: application._id,
      eventId: id,
      startTime: new Date(
        dayjs(dateRange[0]).format("YYYY-MM-DD 00:00:00"),
      ).toISOString(),
      endTime: new Date(
        dayjs(dateRange[1]).add(1, "day").format("YYYY-MM-DD 00:00:00"),
      ).toISOString(),
    })
      .then((data) => {
        trendChartRef.current!.setOption({
          xAxis: {
            type: "category",
            data: data.map((item) => item.date),
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: data.map((item) => item.count),
              type: "line",
            },
          ],
        });
      })
      .finally(() => {
        trendChartRef.current!.hideLoading();
      });
  };

  useEffect(() => {
    trendChartRef.current = echarts.init(
      document.getElementById("trend_chart"),
    );
  }, []);

  useEffect(() => {
    initTrendChart();
  }, [dateRange, application]);

  return (
    <Tabs defaultActiveTab="trend">
      <TabPane key="trend" title="事件趋势">
        <div
          id="trend_chart"
          style={{ width: "calc(100% - 100px)", height: 600, margin: "0 auto" }}
        ></div>
      </TabPane>
      <TabPane key="analysis" title="参数分析"></TabPane>
    </Tabs>
  );
}

export default NormalEventDetailPage;
