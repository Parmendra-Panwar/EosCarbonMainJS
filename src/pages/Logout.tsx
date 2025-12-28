import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

const dispatch = useAppDispatch();
dispatch(logout());
