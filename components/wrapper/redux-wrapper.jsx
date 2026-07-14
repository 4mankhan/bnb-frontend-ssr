"use client";
import { store } from "@/lib/store/store";
import { Provider } from "react-redux";
import HydrationWrapper from "./hydration-wrapper";

export default function ReduxWrapper({ children }) {
  return (
    <Provider store={store}>
      <HydrationWrapper>{children}</HydrationWrapper>
    </Provider>
  );
}
