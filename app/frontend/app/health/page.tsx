export default async function Healthpage() {
  const res = await fetch("http://localhost:3001/health", {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div>
      API Health Check -----| Status: {data.status}
    </div>
  );
}
