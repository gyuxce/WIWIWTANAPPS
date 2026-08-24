import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { StoreStateType } from "stores";
import { setCrashReportingUser } from "utils/CrashReporting";

const CrashReportingUser = () => {
  const { user } = useSelector((state: StoreStateType) => state.persist);

  useEffect(() => {
    setCrashReportingUser(user?.id);
  }, [user?.id]);

  return null;
};

export default CrashReportingUser;
