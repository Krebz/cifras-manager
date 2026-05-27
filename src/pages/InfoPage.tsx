import { portalStyles } from "../styles/portalStyles";

type Props = {
  kind: "management" | "contact";
  isDark: boolean;
};

export default function InfoPage({ kind, isDark }: Props) {
  const styles = portalStyles(isDark);
  const management = kind === "management";

  return (
    <main style={styles.surface}>
      <p style={styles.eyebrow}>
        {management ? "Próxima etapa" : "Fale conosco"}
      </p>
      <h1 style={{ ...styles.title, fontSize: "clamp(26px, 4vw, 36px)" }}>
        {management ? "Gestão de cifras" : "Contato"}
      </h1>
      <p style={{ ...styles.description, marginTop: "14px", maxWidth: "640px" }}>
        {management
          ? "Aqui será possível cadastrar, editar e excluir músicas cifradas. A navegação já está pronta para receber o painel administrativo."
          : "Esta área poderá receber informações da pastoral, formulário ou canais para pedidos de novas cifras."}
      </p>
    </main>
  );
}
