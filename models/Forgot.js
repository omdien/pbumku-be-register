// import db_hc from "../config/Database.js";
import transporter from "../config/MailConfig.js";

const sendResetPasswordEmail = async (to, NAMA, link) => {
  console.log("📨 Menyiapkan email reset password ke:", to);
  try {
    const info = await transporter.sendMail({
      from: `"SIAP MUTU KKP" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Reset Password Akun Anda",
      html: `
        <p>YTH, ${NAMA}</p>
        
        <p>Silakan klik link berikut untuk mengatur ulang password Anda:</p>
        <a href="${link}">${link}</a>
        <p>Link ini berlaku selama 1 jam.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <p>Admin</p>
        <p>Gedung Mina Bahari 2 Lantai 6</p>
        <p>Jalan Medan Merdeka Timur No. 16, Jakarta - 10110</p>
        <p>Telp. 021 3519070 (HUNTING)</p>
        <p>Fax. 021 3513282</p>
        <p>Email : siapmutu@kkp.go.id</p>
        <P>Kotak Pos 4130 JKP 10041</p>
      `,  
    });
    console.log("✅ Email berhasil dikirim:", info.messageId);
  } catch (err) {
    console.error("❌ Gagal mengirim email reset password:", err);
    throw err; 
  }
};

export default sendResetPasswordEmail;