export type User = {
  id: string;
  role: "government" | "ngo" | "farmer" | "company";
  name: string;
  mobile: string;
  password: string; // mock only
  token: string;
};
