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

    // Lead details
    const name =
      record?.name ||
      record?.full_name ||
      record?.customer_name ||
      "Website Lead";

    const mobile =
      record?.mobile ||
      record?.phone ||
      record?.mobile_number ||
      "Not provided";

    const email =
      record?.email ||
      "Not provided";

    const insuranceType =
      record?.insurance_type ||
      record?.insurance ||
      record?.type ||
      "Not specified";

    const city =
      record?.city ||
      record?.location ||
      "Not provided";

    const source =
      record?.source ||
      "Insurance Gyani Website";

    // Zoho SMTP settings
    const smtpHost =
      Deno.env.get("ZOHO_SMTP_HOST") || "smtp.zoho.in";

    const smtpPort =
      Number(Deno.env.get("ZOHO_SMTP_PORT") || "465");

    const smtpUser =
      Deno.env.get("ZOHO_SMTP_USER");

    const smtpPassword =
      Deno.env.get("ZOHO_SMTP_PASSWORD");

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

      subject: `🚨 New ${insuranceType} Lead - Insurance Gyani`,

      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:20px;background:#f4f7fb;font-family:Arial,sans-serif">

          <div style="
            max-width:650px;
            margin:auto;
            background:#ffffff;
            border-radius:12px;
            padding:30px;
            box-shadow:0 3px 15px rgba(0,0,0,0.08);
          ">

            <h2 style="margin-top:0;color:#0b3b66;">
              🚨 New Insurance Lead
            </h2>

            <p style="color:#555;">
              A new lead has been submitted on the
              <b>Insurance Gyani</b> website.
            </p>

            <table
              cellpadding="12"
              cellspacing="0"
              style="
                border-collapse:collapse;
                width:100%;
                margin-top:20px;
              "
            >

              <tr>
                <td style="border:1px solid #ddd;"><b>Name</b></td>
                <td style="border:1px solid #ddd;">${name}</td>
              </tr>

              <tr>
                <td style="border:1px solid #ddd;"><b>Mobile</b></td>
                <td style="border:1px solid #ddd;">${mobile}</td>
              </tr>

              <tr>
                <td style="border:1px solid #ddd;"><b>Email</b></td>
                <td style="border:1px solid #ddd;">${email}</td>
              </tr>

              <tr>
                <td style="border:1px solid #ddd;"><b>Insurance Type</b></td>
                <td style="border:1px solid #ddd;">${insuranceType}</td>
              </tr>

              <tr>
                <td style="border:1px solid #ddd;"><b>City</b></td>
                <td style="border:1px solid #ddd;">${city}</td>
              </tr>

              <tr>
                <td style="border:1px solid #ddd;"><b>Source</b></td>
                <td style="border:1px solid #ddd;">${source}</td>
              </tr>

            </table>

            <div style="
              margin-top:25px;
              padding:15px;
              background:#eef7ff;
              border-radius:8px;
            ">
              <b>Action Required:</b>
              Please contact the customer as soon as possible.
            </div>

            <p style="margin-top:25px;color:#777;">
              — Insurance Gyani
            </p>

          </div>

        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", info.messageId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead notification email sent successfully",
        messageId: info.messageId,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

  } catch (error) {

    console.error("EMAIL FUNCTION ERROR:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error
          ? error.message
          : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
});