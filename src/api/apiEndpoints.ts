export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
  },

  FARMER: {
    REGISTER_LAND: "/farmer/land",
    CREATE_CREDIT: "/farmer/credit",
  },

  NGO: {
    VERIFY_FARMER: "/ngo/verify-farmer",
    VERIFY_LAND: "/ngo/verify-land",
    VERIFY_CREDIT_L1: "/ngo/verify-credit",
  },

  GOVERNMENT: {
    VERIFY_CREDIT_L2: "/gov/verify-credit",
    LIST_FOR_SALE: "/gov/list-credit",
  },

  COMPANY: {
    BUY_CREDIT: "/company/buy",
    SELL_CREDIT: "/company/sell",
  },

  COMMON: {
    CREDITS: "/credits",
    TRANSACTIONS: "/transactions",
  },
};
