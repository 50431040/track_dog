import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { IApplication } from "../dto/Application";

// state类型定义
type State = {
  selectedApplication: IApplication | null;
  applicationList: IApplication[];
};

// action类型定义
type Action = {
  updateSelectedApplication: (application: IApplication) => void;
  updateApplicationList: (applicationList: IApplication[]) => void;
};

const useGlobalStore = create(
  // 允许直接修改，不必返回新的对象
  immer(
    // 持久化
    persist<State & Action>(
      (set) => ({
        selectedApplication: null,
        applicationList: [],
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
      }),
      {
        // store name
        name: "globalStore",
      },
    ),
  ),
);

export default useGlobalStore;
