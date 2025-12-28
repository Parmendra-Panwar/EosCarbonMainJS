const useMock = import.meta.env.VITE_USE_MOCK_API === "true";

export async function mockResponse<T>(data: T, delay = 800) {
  if (!useMock) return null;

  await new Promise(res => setTimeout(res, delay));
  return data;
}
