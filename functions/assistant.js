export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { messages } = await request.json();
    if (!Array.isArray(messages)) {
      return new Response('Invalid payload', { status: 400 });
    }
    const result = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });
    const reply = result?.response ?? result?.message?.content ?? '';
    return Response.json({ reply });
  } catch (err) {
    return new Response('Failed to generate response', { status: 500 });
  }
}
