// utils/emailTemplates.js
export const registrationConfirmationTemplate = ({ namaUser, namaUpt, alamatUpt }) => {
    return {
        subject: "Konfirmasi Registrasi SiapMutu",
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                <p>Yth. ${namaUser},</p>
                <p>
                    Registrasi Anda pada Sistem SiapMutu telah kami terima.
                    Untuk proses konfirmasi dan verifikasi lebih lanjut,
                    mohon menghubungi unit pelaksana teknis berikut:
                </p>
                <table style="margin: 12px 0;">
                    <tr><td style="padding-right: 8px;"><strong>UPT</strong></td><td>: ${namaUpt}</td></tr>
                    <tr><td style="padding-right: 8px;"><strong>Alamat</strong></td><td>: ${alamatUpt || "-"}</td></tr>
                </table>
                <p>Terima kasih.</p>
                <p style="color: #888; font-size: 12px;">
                    Email ini dikirim otomatis oleh sistem, mohon tidak membalas email ini.
                </p>
            </div>
        `,
    };
};