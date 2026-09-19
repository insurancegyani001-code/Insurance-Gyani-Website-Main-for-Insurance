import nodemailer from "npm:nodemailer";

Deno.serve(async (req) => {
  try {
    // Allow only POST requests
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Method not allowed",
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Read webhook payload
    const payload = await req.json();
    console.log("Received payload:", JSON.stringify(payload));

    // Supabase database webhook / trigger payload
    const record = payload?.record || payload?.new_record || payload;
    const tableType = payload?.type || payload?.table || record?.table_name || "";

    // Common details
    const name =
      record?.name ||
      record?.full_name ||
      record?.customer_name ||
      "Not provided";

    const mobile =
      record?.mobile ||
      record?.phone ||
      record?.mobile_number ||
      "Not provided";

    const email =
      record?.email ||
      "Not provided";

    let subject = "🚨 New Lead - Insurance Gyani";
    let emailRows = "";

    // Check table/form type to render specific details
    if (tableType.includes("policy") || record?.company_name !== undefined || record?.policy_type !== undefined && record?.experience === undefined) {
      subject = "📄 New Policy Review Request - Insurance Gyani";
      const policyType = record?.policy_type || record?.insurance_type || "Not specified";
      const companyName = record?.company_name || record?.company || "Not specified";
      const planName = record?.plan_name || record?.plan || "Not specified";
      const city = record?.city || record?.location || "Not provided";

      emailRows = `
        <tr><td style="border:1px solid #ddd;"><b>Name</b></td><td style="border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Mobile</b></td><td style="border:1px solid #ddd;">${mobile}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Email</b></td><td style="border:1px solid #ddd;">${email}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Policy Type</b></td><td style="border:1px solid #ddd;">${policyType}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Company Name</b></td><td style="border:1px solid #ddd;">${companyName}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Plan Name</b></td><td style="border:1px solid #ddd;">${planName}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>City</b></td><td style="border:1px solid #ddd;">${city}</td></tr>
      `;
    } else if (tableType.includes("advisor") || record?.experience !== undefined || record?.employment_type !== undefined) {
      subject = "⭐ New Advisor Application - Insurance Gyani";
      const experience = record?.experience || record?.insurance_experience || "Not specified";
      const employmentType = record?.employment_type || record?.work_type || "Not specified";
      const bio = record?.bio || record?.message || record?.about || "Not provided";
      const city = record?.city || record?.location || "Not provided";

      emailRows = `
        <tr><td style="border:1px solid #ddd;"><b>Name</b></td><td style="border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Mobile</b></td><td style="border:1px solid #ddd;">${mobile}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Email</b></td><td style="border:1px solid #ddd;">${email}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Insurance Experience</b></td><td style="border:1px solid #ddd;">${experience}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Employment Type</b></td><td style="border:1px solid #ddd;">${employmentType}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>City</b></td><td style="border:1px solid #ddd;">${city}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>About / Bio</b></td><td style="border:1px solid #ddd;">${bio}</td></tr>
      `;
    } else {
      subject = "🎯 New General Lead - Insurance Gyani";
      const insuranceType = record?.insurance_type || record?.insurance || record?.type || "Not specified";
      const city = record?.city || record?.location || "Not provided";
      const source = record?.source || "Insurance Gyani Website";

      emailRows = `
        <tr><td style="border:1px solid #ddd;"><b>Name</b></td><td style="border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Mobile</b></td><td style="border:1px solid #ddd;">${mobile}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Email</b></td><td style="border:1px solid #ddd;">${email}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Insurance Type</b></td><td style="border:1px solid #ddd;">${insuranceType}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>City</b></td><td style="border:1px solid #ddd;">${city}</td></tr>
        <tr><td style="border:1px solid #ddd;"><b>Source</b></td><td style="border:1px solid #ddd;">${source}</td></tr>
      `;
    }

    // Zoho SMTP settings
    const smtpHost = Deno.env.get("ZOHO_SMTP_HOST") || "smtp.zoho.in";
    const smtpPort = Number(Deno.env.get("ZOHO_SMTP_PORT") || "465");
    const smtpUser = Deno.env.get("ZOHO_SMTP_USER");
    const smtpPassword = Deno.env.get("ZOHO_SMTP_PASSWORD");

    // Check SMTP credentials
    if (!smtpUser || !smtpPassword) {
      throw new Error(
        "Zoho SMTP credentials are missing. Check ZOHO_SMTP_USER and ZOHO_SMTP_PASSWORD secrets.",
      );
    }

    console.log("Connecting to Zoho SMTP...");

    // Create Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Verify SMTP connection
    await transporter.verify();

    console.log("Zoho SMTP connection successful.");

    // Send email
    const info = await transporter.sendMail({
      from: `"Insurance Gyani" <${smtpUser}>`,
      to: "info@insurancegyani.in",
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:20px;background:#f4f7fb;font-family:Arial,sans-serif">
          <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 3px 15px rgba(0,0,0,0.08);">
            <h2 style="margin-top:0;color:#0b3b66;">${subject}</h2>
            <p style="color:#555;">A new submission has been received from the <b>Insurance Gyani</b> website.</p>
            <table cellpadding="12" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:20px;">
              ${emailRows}
            </table>
            <div style="margin-top:25px;padding:15px;background:#eef7ff;border-radius:8px;">
              <b>Action Required:</b> Please review and contact the user as soon as possible.
            </div>
            <p style="margin-top:25px;color:#777;">— Insurance Gyani</p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification email sent successfully",
        messageId: info.messageId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );

  } catch (error) {
    console.error("EMAIL FUNCTION ERROR:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});