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

export const verificationApprovedTemplate = ({ namaUser, namaUpt, alamatUpt }) => {
    return {
        subject: "Akun SiapMutu Anda Telah Disetujui",
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                <p>Yth. ${namaUser},</p>
                <p>
                    Permohonan akun Anda pada Sistem SiapMutu telah kami
                    <strong style="color:#198754;">verifikasi dan setujui</strong>.
                    Akun Anda kini aktif dan dapat digunakan untuk mengakses layanan
                    sertifikasi pada aplikasi SiapMutu.
                </p>
                <table style="margin: 12px 0;">
                    <tr><td style="padding-right: 8px;"><strong>UPT</strong></td><td>: ${namaUpt}</td></tr>
                    <tr><td style="padding-right: 8px;"><strong>Alamat</strong></td><td>: ${alamatUpt || "-"}</td></tr>
                </table>
                <p>Silakan login menggunakan username dan password yang telah Anda daftarkan.</p>
                <p>Terima kasih.</p>
                <p style="color: #888; font-size: 12px;">
                    Email ini dikirim otomatis oleh sistem, mohon tidak membalas email ini.
                </p>
            </div>
        `,
    };
};

export const verificationRejectedTemplate = ({ namaUser, alasan }) => {
    return {
        subject: "Permohonan Akun SiapMutu Perlu Kelengkapan Data",
        html: `
            <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
                <p>Yth. ${namaUser},</p>
                <p>
                    Mohon maaf, permohonan akun Anda pada Sistem SiapMutu
                    <strong style="color:#dc3545;">belum dapat kami setujui</strong>
                    untuk saat ini, dengan keterangan sebagai berikut:
                </p>
                <div style="background:#f8f9fa; border-left:4px solid #dc3545; padding:10px 14px; margin:12px 0;">
                    ${alasan}
                </div>
                <p>
                    Mohon lengkapi/perbaiki data sesuai keterangan di atas, kemudian ajukan
                    kembali permohonan melalui menu registrasi pada aplikasi SiapMutu.
                </p>
                <p>Terima kasih.</p>
                <p style="color: #888; font-size: 12px;">
                    Email ini dikirim otomatis oleh sistem, mohon tidak membalas email ini.
                </p>
            </div>
        `,
    };
};