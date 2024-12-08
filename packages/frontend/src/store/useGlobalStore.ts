import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IApplication } from "../dto/Application";
import dayjs from "dayjs";

// state类型定义
type State = {
  selectedApplication: IApplication | null;
  applicationList: IApplication[];
  dateRange: [Date, Date];
};

// action类型定义
type Action = {
  updateSelectedApplication: (application: IApplication) => void;
  updateApplicationList: (applicationList: IApplication[]) => void;
  updateDateRange: (dateRange: [Date, Date]) => void;
};

const useGlobalStore = create(
  // 允许直接修改，不必返回新的对象
  immer(
    // 持久化
    persist<State & Action>(
      (set) => ({
        selectedApplication: null,
        applicationList: [],
        dateRange: [dayjs().subtract(1, "month").toDate(), dayjs().toDate()],
        updateSelectedApplication: (application) =>
          set(() => {
            return {
              selectedApplication: application,
            };
          }),
        updateApplicationList: (applicationList) =>
          set(() => {
            return {
              applicationList,
            };
          }),
        updateDateRange: (dateRange) =>
          set(() => {
            return {
              dateRange,
            };
          }),
      }),
      {
        // store name
        name: "globalStore",
      },
    ),
  ),
);

export default useGlobalStore;
