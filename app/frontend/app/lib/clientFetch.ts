export async function clientFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401) {
    window.location.replace('/login');
    return new Promise<Response>(() => {});
  }
  return res;
}
