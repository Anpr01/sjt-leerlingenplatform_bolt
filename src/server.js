import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/api/verify-turnstile', async (req, res) => {
  const { token } = req.body;
  const secret = process.env.CF_TURNSTILE_SECRET;

  try {
    const cfRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    });
    const { success } = await cfRes.json();
    res.json({ ok: success });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

app.listen(process.env.PORT || 3000);
