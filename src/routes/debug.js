import { Router } from 'express';
import net from 'net';

const router = new Router();

// Quick TCP connect test to an SMTP host:port to verify outbound connectivity from the running instance.
// Usage: GET /debug/smtp-test?host=smtp.example.com&port=587&timeout=5000
router.get('/smtp-test', (req, res) => {
  const host = req.query.host || process.env.SMTP_HOST;
  const port = Number(req.query.port) || Number(process.env.SMTP_PORT) || 465;
  const timeout = Number(req.query.timeout) || 5000;

  if (!host) {
    return res.status(400).json({ ok: false, error: 'Missing host (provide ?host= or set SMTP_HOST env)' });
  }

  const socket = new net.Socket();
  let finished = false;

  const cleanup = () => {
    try {
      socket.destroy();
    } catch (_e) {
      // ignore
    }
  };

  const onSuccess = () => {
    if (finished) return;
    finished = true;
    cleanup();
    res.json({ ok: true, host, port, message: 'TCP connect succeeded' });
  };

  const onFailure = (err) => {
    if (finished) return;
    finished = true;
    cleanup();
    res.status(502).json({ ok: false, host, port, error: err && err.message, code: err && err.code });
  };

  socket.setTimeout(timeout, () => onFailure(new Error('connection timeout')));
  socket.once('error', onFailure);
  socket.connect(port, host, onSuccess);
});

export default router;
