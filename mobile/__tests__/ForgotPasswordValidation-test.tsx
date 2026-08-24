/**
 * Regression test: the "Kirim tautan" button on ForgotPasswordScreen must
 * become enabled once a valid email is entered.
 */
import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ForgotPasswordScreen from "../src/screens/ForgotPasswordScreen/ForgotPasswordScreen";
import TextInputComponent from "../src/components/TextInput";

const inset = { top: 0, left: 0, right: 0, bottom: 0 };
const frame = { x: 0, y: 0, width: 0, height: 0 };

jest.mock("hooks/useAuth", () => ({
  useAuth: () => ({
    postForgotPassword: jest.fn().mockResolvedValue({ status: "success" }),
  }),
}));

jest.mock("utils/NavigationService", () => ({
  __esModule: true,
  default: { replace: jest.fn(), navigate: jest.fn(), back: jest.fn() },
}));

const store = configureStore({
  reducer: {
    error: (state = {}, _action: any) => state,
  },
});

test(
  "Kirim tautan button becomes enabled after valid email",
  async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(
        <SafeAreaProvider initialMetrics={{ insets: inset, frame }}>
          <Provider store={store}>
            <ForgotPasswordScreen />
          </Provider>
        </SafeAreaProvider>,
      );
    });

    const getInput = () =>
      renderer!.root.findAllByType(TextInputComponent as any)[0]!;
    const getButton = () =>
      renderer!.root.findAll(
        node => node.props && node.props.title === "Kirim tautan",
      )[0]!;

    expect(getButton().props.disabled).toBe(true);

    await act(async () => {
      getInput().props.onChange("test@example.com");
    });

    expect(getButton().props.disabled).toBe(false);
  },
  20000,
);
