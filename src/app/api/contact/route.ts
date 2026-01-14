import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactRequest {
  name: string;
  email: string;
  message: string;
  quoteSummary?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Service email non configuré" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const body: ContactRequest = await request.json();
    const { name, email, message, quoteSummary } = body;

    const isQuoteRequest = !!quoteSummary;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nom et email requis" },
        { status: 400 }
      );
    }

    if (!isQuoteRequest && !message) {
      return NextResponse.json(
        { error: "Message requis" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    const subject = isQuoteRequest
      ? `[Portfolio] Simulation de devis - ${name}`
      : `[Portfolio] Nouveau message de ${name}`;

    let htmlContent = `
      <h2>${isQuoteRequest ? "Nouvelle simulation de devis" : "Nouveau message depuis le portfolio"}</h2>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
    `;

    if (isQuoteRequest) {
      htmlContent += `
        <hr style="border: 1px solid #eee; margin: 20px 0;" />
        <h3>Simulation</h3>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; white-space: pre-wrap;">${quoteSummary}</pre>
      `;

      if (message) {
        htmlContent += `
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <h3>Message additionnel</h3>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `;
      }
    } else {
      htmlContent += `
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `;
    }

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "enzo.gazzoli@icloud.com",
      replyTo: email,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
