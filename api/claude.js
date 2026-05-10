export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const { messages = [], system = '' } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(JSON.stringify({ error: 'Anthropic API error', detail: errText }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }

    const data = await response.json();
    const text = data?.content?.find((item) => item.type === 'text')?.text || '';

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Request failed', detail: String(error) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
