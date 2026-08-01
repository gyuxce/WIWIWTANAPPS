import { getApiErrorStatus } from "../src/utils/ApiResponse";

test("does not surface an error while auth recovery is handling 401", () => {
  expect(getApiErrorStatus(401)).toBeNull();
});

test("preserves numeric API errors", () => {
  expect(getApiErrorStatus(500)).toBe(500);
  expect(getApiErrorStatus(400)).toBe(400);
});

test("uses internal server as the fallback for malformed responses", () => {
  expect(getApiErrorStatus(undefined)).toBe(500);
});
