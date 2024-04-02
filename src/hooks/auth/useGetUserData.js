import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../services/auth";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/authSlice";
import { useAuthQuery } from "../common/useAuthQuery";

export function useGetUserData() {
  const dispatch = useDispatch();
  const {
    data: userData,
    isSuccess,
    ...queryRest
  } = useAuthQuery(
    ["user"], // queryKey
    getUserData // queryFn
  );

  useEffect(() => {
    if (isSuccess && userData?.user) {
      dispatch(setUserData({ userData: userData.user }));
    }
  }, [isSuccess, userData, dispatch]);

  return {
    data: userData,
    isSuccess,
    ...queryRest,
  };
}
