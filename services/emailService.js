// services/emailService.js
import transporter from "../config/MailConfig.js";
import { 
    registrationConfirmationTemplate,
    verificationApprovedTemplate,
    verificationRejectedTemplate,
} from "../utils/emailTemplates.js";
import { getUptByKode } from "./uptService.js";

export const sendRegistrationConfirmationEmail = async ({ toEmail, namaUser, kdUnit }) => {
    const upt = await getUptByKode(kdUnit);

    const namaUpt = upt?.NM_UNIT_BARU || upt?.NM_UNIT || "-";
    const alamatUpt = upt?.ALAMAT_UNIT || "-";

    const { subject, html } = registrationConfirmationTemplate({
        namaUser,
        namaUpt,
        alamatUpt,
    });

    await transporter.sendMail({
        from: `"SiapMutu KKP" <${process.env.EMAIL_FROM}>`,
        to: toEmail,
        subject,
        html,
    });
};

export const sendVerificationApprovedEmail = async ({ toEmail, namaUser, kdUnit }) => {
    const upt = await getUptByKode(kdUnit);
    const namaUpt = upt?.NM_UNIT_BARU || upt?.NM_UNIT || "-";
    const alamatUpt = upt?.ALAMAT_UNIT || "-";

    const { subject, html } = verificationApprovedTemplate({ namaUser, namaUpt, alamatUpt });

    await transporter.sendMail({
        from: `"SiapMutu KKP" <${process.env.EMAIL_FROM}>`,
        to: toEmail,
        subject,
        html,
    });
};

export const sendVerificationRejectedEmail = async ({ toEmail, namaUser, alasan }) => {
    const { subject, html } = verificationRejectedTemplate({ namaUser, alasan });

    await transporter.sendMail({
        from: `"SiapMutu KKP" <${process.env.EMAIL_FROM}>`,
        to: toEmail,
        subject,
        html,
    });
};