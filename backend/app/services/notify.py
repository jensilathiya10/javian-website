import logging
import smtplib
from email.message import EmailMessage

from app.core.config import Settings, get_settings

log = logging.getLogger("javian.notify")


def _one_line(value: str | None) -> str:
    """Header-safe text: visitors control these values, so strip anything that could add headers."""
    return " ".join((value or "").split())


def notifications_enabled(s: Settings) -> bool:
    return bool(s.smtp_host and s.notify_to)


def build_message(
    s: Settings, *, reference: str, name: str, email: str, company: str | None, service: str, budget: str | None, message: str
) -> EmailMessage:
    recipients = [r.strip() for r in (s.notify_to or "").split(",") if r.strip()]
    msg = EmailMessage()
    msg["Subject"] = f"New inquiry {reference}: {_one_line(name)[:60]} ({service})"
    msg["From"] = s.notify_from or s.smtp_user or "noreply@localhost"
    msg["To"] = ", ".join(recipients)
    msg["Reply-To"] = email  # validated EmailStr; replying goes straight to the visitor
    msg.set_content(
        "\n".join(
            [
                f"Reference: {reference}",
                f"Name:      {_one_line(name)}",
                f"Email:     {email}",
                f"Company:   {_one_line(company) or '-'}",
                f"Service:   {service}",
                f"Budget:    {budget or '-'}",
                "",
                "Message:",
                message,
                "",
                "Reply to this email to answer the visitor directly.",
            ]
        )
    )
    return msg


def send_inquiry_email(**inquiry) -> None:
    """Send the notification. Runs in a background task: it must never raise or block a request."""
    s = get_settings()
    if not notifications_enabled(s):
        return
    try:
        msg = build_message(s, **inquiry)
        if s.smtp_port == 465:
            server: smtplib.SMTP = smtplib.SMTP_SSL(s.smtp_host, s.smtp_port, timeout=10)
        else:
            server = smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=10)
        with server:
            if s.smtp_port != 465 and s.smtp_starttls:
                server.starttls()
            if s.smtp_user and s.smtp_password:
                server.login(s.smtp_user, s.smtp_password)
            server.send_message(msg)
        log.info("inquiry notification sent for %s", inquiry.get("reference"))
    except Exception:  # noqa: BLE001 - the inquiry is already saved; mail trouble is logged only
        log.exception("inquiry notification failed for %s", inquiry.get("reference"))
