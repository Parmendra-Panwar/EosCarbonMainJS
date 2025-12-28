import { useAppDispatch } from "../app/hooks";
import { logout } from "../app/authSlice";

const dispatch = useAppDispatch();
dispatch(logout());
