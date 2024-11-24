import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// state类型定义
type State = {};

// action类型定义
type Action = {};

/** 用户信息相关【示例，正式使用请删除】 */
const useUserStore = create(
  // 允许直接修改，不必返回新的对象
  immer(
    // 持久化
    persist<State & Action>((set) => ({}), {
      // store name
      name: "user",
    })
  )
);

export default useUserStore;
