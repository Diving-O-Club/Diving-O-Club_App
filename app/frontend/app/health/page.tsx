export default async function HealthPage() {
  const baseUrl = process.env.API_INTERNAL_URL ?? "http://backend:3001";

  const res = await fetch(`${baseUrl}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const data = await res.json();

  return (
    <div>
      API Health Check -----| Status: {data.status}
    </div>
  );
}
