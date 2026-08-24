/**
 * Regression test: the "Lanjutkan" (register) button in the first signup
 * step must become enabled once email/password/confirmPassword are valid
 * and matching.
 */
import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { useForm } from "react-hook-form";
import FirstStep from "../src/screens/LoginScreen/SignupSteps/FirstStep";
import TextInputComponent from "../src/components/TextInput";

const Harness = () => {
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ mode: "onChange" });
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    confirmPassword: "",
  } as any);

  return (
    <FirstStep
      onPress={() => {}}
      onPressGoogleLogin={() => {}}
      onPressFacebookLogin={() => {}}
      onPressAppleLogin={() => {}}
      form={form}
      setForm={setForm}
      control={control}
      errors={errors}
      watch={watch}
      setError={setError}
      clearErrors={clearErrors}
    />
  );
};

test(
  "Lanjutkan button becomes enabled after valid matching input",
  async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => {
      renderer = TestRenderer.create(<Harness />);
    });

    const getTextInputs = () =>
      renderer!.root.findAllByType(TextInputComponent as any);
    const getButton = () =>
      renderer!.root.findAll(
        node => node.props && node.props.title === "Lanjutkan",
      )[0]!;

    expect(getButton().props.disabled).toBe(true);

    await act(async () => {
      getTextInputs()[0]!.props.onChange("test@example.com"); // email
    });
    await act(async () => {
      getTextInputs()[1]!.props.onChange("Password123"); // password
    });
    await act(async () => {
      getTextInputs()[2]!.props.onChange("Password123"); // confirmPassword matching
    });

    expect(getButton().props.disabled).toBe(false);
  },
  20000,
);
