function cors() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...cors() },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors() });

    if (url.pathname === "/api/board" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT name,message,mode,result,stats,at FROM entries ORDER BY at DESC LIMIT 50"
      ).all();
      return json({ entries: results || [] });
    }

    if (url.pathname === "/api/board" && request.method === "POST") {
      const body = await request.json();
      const entry = {
        name: String(body?.name || "Anonymous").slice(0, 18),
        message: String(body?.message || "Kilroy was here.").slice(0, 60),
        mode: String(body?.mode || "").slice(0, 40),
        result: String(body?.result || "").slice(0, 40),
        stats: String(body?.stats || "").slice(0, 220),
        at: Number(body?.at || Date.now()),
      };

      await env.DB.prepare(
        "INSERT INTO entries (name,message,mode,result,stats,at) VALUES (?,?,?,?,?,?)"
      )
        .bind(entry.name, entry.message, entry.mode, entry.result, entry.stats, entry.at)
        .run();

      return json({ ok: true }, 201);
    }

    return json({ error: "Not found" }, 404);
  },
};
