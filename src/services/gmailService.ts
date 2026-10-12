/**
 * Gmail Service untuk mengirim email sambutan member dan konfirmasi kegiatan
 * Menggunakan Google Gmail API v1 (Client-side dengan Bearer OAuth Token)
 */

export interface SendEmailParams {
  to: string;
  subject: string;
  bodyHtml: string;
  fromName?: string;
}

/**
 * Format RFC 2822 dan encode Base64URL sesuai spesifikasi Gmail API
 */
export const createRawEmail = (params: SendEmailParams): string => {
  const { to, subject, bodyHtml, fromName = 'Yuru Camp Jabodetabek' } = params;

  // Encode subject UTF-8
  const utf8Subject = unescape(encodeURIComponent(subject));
  const encodedSubject = `=?utf-8?B?${btoa(utf8Subject)}?=`;

  const emailLines = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyHtml
  ];

  const emailString = emailLines.join('\r\n');
  const base64 = btoa(unescape(encodeURIComponent(emailString)));
  // RFC 4648 Base64URL: ganti + dengan -, / dengan _, buang padding =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Kirim email resmi melalui Gmail API
 */
export const sendGmailMessage = async (
  accessToken: string,
  params: SendEmailParams
): Promise<{ id: string; threadId: string }> => {
  const raw = createRawEmail(params);
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Gagal mengirim email via Gmail (Status: ${response.status}). Pastikan izin Gmail telah disetujui.`
    );
  }

  return response.json();
};

/**
 * Template Email Sambutan Resmi Member Baru Yuru Camp Jabodetabek
 */
export const generateWelcomeEmailHtml = (
  userName: string,
  memberId: string,
  userEmail: string,
  domisili = 'Jabodetabek'
): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Selamat Datang di Yuru Camp Jabodetabek</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #fcfbf9; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 2px solid #0f172a; border-radius: 24px; box-shadow: 6px 6px 0px 0px #0f172a; overflow: hidden;">
    <!-- Header Banner -->
    <tr>
      <td style="background-color: #f59e0b; padding: 30px; text-align: center; border-bottom: 2px solid #0f172a;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;">
          🏕️ YURU CAMP JABODETABEK
        </h1>
        <p style="margin: 6px 0 0; font-size: 13px; font-weight: 700; color: #78350f;">
          Komunitas Berkemah Santai, Ramah Pemula & Beretika Alam
        </p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding: 32px 28px;">
        <h2 style="margin: 0 0 12px; font-size: 18px; font-weight: 800; color: #0f172a;">
          Halo, Sahabat Camper ${userName}! 🎉
        </h2>
        <p style="margin: 0 0 18px; font-size: 14px; line-height: 1.6; color: #475569;">
          Selamat! Akun Google Anda telah resmi terhubung dan terdaftar sebagai <strong>Anggota Komunitas Yuru Camp Jabodetabek</strong>.
        </p>

        <!-- Kartu Identitas Member -->
        <div style="background-color: #f8fafc; border: 2px solid #0f172a; border-radius: 16px; padding: 18px; margin-bottom: 24px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="4">
            <tr>
              <td width="35%" style="font-size: 12px; color: #64748b; font-weight: bold;">ID Anggota Resmi:</td>
              <td width="65%" style="font-size: 14px; color: #0369a1; font-weight: 900; font-family: monospace;">${memberId}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #64748b; font-weight: bold;">Nama Member:</td>
              <td style="font-size: 13px; color: #0f172a; font-weight: bold;">${userName}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #64748b; font-weight: bold;">Email Terdaftar:</td>
              <td style="font-size: 13px; color: #0f172a; font-family: monospace;">${userEmail}</td>
            </tr>
            <tr>
              <td style="font-size: 12px; color: #64748b; font-weight: bold;">Wilayah Domisili:</td>
              <td style="font-size: 13px; color: #0f172a;">${domisili}</td>
            </tr>
          </table>
        </div>

        <h3 style="margin: 0 0 10px; font-size: 15px; font-weight: 800; color: #0f172a;">
          🌟 Hal Yang Bisa Anda Lakukan Sekarang:
        </h3>
        <ul style="margin: 0 0 24px; padding-left: 20px; font-size: 13px; line-height: 1.7; color: #334155;">
          <li><strong>Daftar Agenda Event</strong>: Ikuti kemping komunal resmi di Mandalawangi, Sukamantri, atau Sentul.</li>
          <li><strong>Buku Panduan & Checklist</strong>: Periksa 19 gear esensial sebelum berangkat.</li>
          <li><strong>Upload Resep Masakan Outdoor</strong>: Bagikan menu camp andalan Anda dan ikut chat diskusi.</li>
          <li><strong>Review Gear Camping</strong>: Bagikan ulasan tenda, kompor, atau sleeping bag milik Anda.</li>
          <li><strong>Galeri Dokumentasi</strong>: Bagikan foto cerita solo camp langsung dari galeri ponsel Anda.</li>
        </ul>

        <!-- Etika Leave No Trace -->
        <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px; font-size: 12px; color: #065f46; line-height: 1.5;">
          <strong>🌿 Prinsip Leave No Trace:</strong> Harap selalu bawa pulang sampah Anda, hormati satwa liar, dan jaga keheningan malam camp setelah pukul 22.00 WIB.
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 2px solid #0f172a; font-size: 11px; color: #64748b;">
        <p style="margin: 0 0 4px;"><strong>Yuru Camp Jabodetabek (ゆるキャン△)</strong></p>
        <p style="margin: 0;">Lead Developer: ronybimawan2542@gmail.com · Komunitas Berkemah Jabodetabek</p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
