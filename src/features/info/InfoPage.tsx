import { useState, type FormEvent } from "react";
import { portalStyles } from "../../styles/portalStyles";

type Props = {
  kind: "contact";
  isDark: boolean;
};

type Status = "idle" | "sending" | "success" | "error";

export default function InfoPage({ isDark }: Props) {
  const styles = portalStyles(isDark);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "8b5ec7b8-3636-4d25-b71d-e416024f8cca",
          name,
          email,
          message,
          subject: `Mensagem de ${name} — Katando Cifras`,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "success" : "error");
      if (data.success) { setName(""); setEmail(""); setMessage(""); }
    } catch {
      setStatus("error");
    }
  }

  const inputStyle = {
    ...styles.input,
    width: "100%",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: isDark ? "#94a3b8" : "#475569",
    marginBottom: "6px",
    display: "block" as const,
    letterSpacing: "0.3px",
  };

  return (
    <main style={styles.surface}>
      <p style={styles.eyebrow}>Fale conosco</p>
      <h1 style={{ ...styles.title, fontSize: "clamp(26px, 4vw, 36px)", marginBottom: "8px" }}>
        Contato
      </h1>
      <p style={{ ...styles.description, marginBottom: "28px", maxWidth: "560px" }}>
        Sugestões de cifras, dúvidas ou feedback — escreva sua mensagem e responderemos pelo e-mail informado.
      </p>

      {status === "success" ? (
        <div style={{
          padding: "24px",
          borderRadius: "12px",
          background: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.3)",
          maxWidth: "520px",
        }}>
          <p style={{ margin: 0, fontWeight: 600, color: isDark ? "#6ee7b7" : "#059669", fontSize: "15px" }}>
            Mensagem enviada!
          </p>
          <p style={{ margin: "6px 0 16px", fontSize: "13px", color: isDark ? "#94a3b8" : "#64748b" }}>
            Obrigado pelo contato. Responderemos em breve.
          </p>
          <button type="button" style={styles.secondaryAction} onClick={() => setStatus("idle")}>
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px", maxWidth: "520px" }}>
          <div>
            <label htmlFor="contact-name" style={labelStyle}>Nome</label>
            <input
              id="contact-name"
              type="text"
              required
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="contact-email" style={labelStyle}>E-mail</label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="contact-message" style={labelStyle}>Mensagem</label>
            <textarea
              id="contact-message"
              required
              rows={5}
              placeholder="Escreva sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "inherit", lineHeight: 1.5 }}
            />
          </div>

          {status === "error" && (
            <p style={{ margin: 0, fontSize: "13px", color: "#f87171" }}>
              Falha no envio. Tente novamente ou escreva para{" "}
              <a href="mailto:contatos@katandocifras.com.br" style={{ color: "#f87171" }}>
                contatos@katandocifras.com.br
              </a>.
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={status === "sending"}
              style={{ ...styles.primaryButton, opacity: status === "sending" ? 0.7 : 1 }}
            >
              {status === "sending" ? "Enviando..." : "Enviar mensagem"}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
