// api/upload.js — Vercel Serverless Function
// Note: Vercel has a read-only/ephemeral filesystem, so this endpoint
// accepts uploads but cannot permanently save files to disk.
// For persistent image storage, integrate Cloudinary or Supabase Storage.

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // On Vercel, filesystem writes are not persistent.
  // Return a friendly message.
  res.status(200).json({
    message: 'Upload received. Note: file persistence requires external storage (e.g. Cloudinary) on Vercel.',
    path: 'developer_avatar.png'
  });
};
