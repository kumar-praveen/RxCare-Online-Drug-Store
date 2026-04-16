// utils/nodemailer.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

const emailTemplates = {
  // ── Verification Email ───────────────────────────────────────────────
  verification: (name, verifyUrl) => ({
    subject: "Verify Your RxCare Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 16px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #615fff, #4f4fd4); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">
            Rx<span style="opacity: 0.7;">Care</span>
          </h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">
            Your Trusted Online Pharmacy
          </p>
        </div>

        <!-- Body -->
        <div style="background: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin: 0 0 8px; font-size: 22px;">
            Hi ${name} 👋
          </h2>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Thank you for registering with RxCare! Please click the button below to verify your email address and activate your account.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}"
              style="display: inline-block; background: linear-gradient(135deg, #615fff, #4f4fd4); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 700; font-size: 16px; letter-spacing: 0.5px;">
              ✅ Verify My Email
            </a>
          </div>

          <!-- Link fallback -->
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 6px;">
              If the button doesn't work, copy and paste this link in your browser:
            </p>
            <p style="color: #615fff; font-size: 12px; word-break: break-all; margin: 0;">
              ${verifyUrl}
            </p>
          </div>

          <p style="color: #9ca3af; font-size: 12px; margin: 16px 0 0; text-align:center;">
            ⏰ This link expires in <strong>24 hours</strong>
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 8px 0 0; text-align:center;">
            If you did not create an account, please ignore this email.
          </p>
        </div>

        <!-- Trust Badges -->
        <div style="display: flex; gap: 8px; margin: 16px 0; justify-content: center; flex-wrap: wrap;">
          ${["💊 Genuine Medicines", "🚚 Fast Delivery", "🔒 Secure Payments"]
            .map(
              (item) => `
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 20px; padding: 6px 14px; font-size: 12px; color: #6b7280;">
              ${item}
            </div>
          `,
            )
            .join("")}
        </div>

        <!-- Footer -->
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin: 8px 0 0;">
          © ${new Date().getFullYear()} RxCare. All rights reserved.
        </p>
      </div>
    `,
  }),

  // ── Welcome Email ────────────────────────────────────────────────────
  welcome: (name) => ({
    subject: "Welcome to RxCare! 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; border-radius: 16px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #615fff, #4f4fd4); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">
            Rx<span style="opacity: 0.7;">Care</span>
          </h1>
        </div>

        <!-- Body -->
        <div style="background: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; font-size: 22px; margin: 0 0 12px;">
            Welcome aboard, ${name}! 🎉
          </h2>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Your email has been verified successfully. You can now enjoy all the benefits of RxCare — India's most trusted online pharmacy.
          </p>

          <!-- Benefits -->
          <div style="margin: 0 0 24px; display: flex; flex-direction: column; gap: 10px;">
            ${[
              {
                icon: "💊",
                title: "Order Medicines",
                desc: "Browse 1000+ genuine medicines and healthcare products",
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                desc: "Get medicines delivered safely to your doorstep",
              },
              {
                icon: "💰",
                title: "Best Prices",
                desc: "Save up to 50% with exclusive offers and discounts",
              },
              {
                icon: "👨‍⚕️",
                title: "Expert Support",
                desc: "Get guidance from certified pharmacists anytime",
              },
            ]
              .map(
                (b) => `
              <div style="display: flex; align-items: center; gap: 14px; padding: 14px; background: #f9fafb; border-radius: 10px; border: 1px solid #f3f4f6;">
                <span style="font-size: 26px;">${b.icon}</span>
                <div>
                  <p style="margin: 0; font-weight: 700; color: #1f2937; font-size: 14px;">${b.title}</p>
                  <p style="margin: 4px 0 0; color: #6b7280; font-size: 13px;">${b.desc}</p>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>

          <!-- CTA -->
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/products"
              style="display: inline-block; background: linear-gradient(135deg, #615fff, #4f4fd4); color: white; text-decoration: none; padding: 14px 40px; border-radius: 50px; font-weight: 700; font-size: 15px;">
              Start Shopping Now →
            </a>
          </div>
        </div>

        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin: 16px 0 0;">
          © ${new Date().getFullYear()} RxCare. All rights reserved.
        </p>
      </div>
    `,
  }),
};

export const sendEmail = async ({ to, type, name, verifyUrl }) => {
  const template = emailTemplates[type](name, verifyUrl);
  await transporter.sendMail({
    from: `"RxCare" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: template.subject,
    html: template.html,
  });
};
