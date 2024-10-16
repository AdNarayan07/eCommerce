export function generateConfig(token, data) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data
  };
}
