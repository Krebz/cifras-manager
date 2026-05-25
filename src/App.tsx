import { useEffect, useState } from "react";
import { Button, Stack, Text, Title } from "@mantine/core";
import SongViewer from "./components/SongViewer";
import { song } from "./data/song";
import { transposeKey } from "./services/transposeKey";

function App() {
  // controla a transposição da música em semitons
  // exemplo:
  // 0 = tom original
  // +1 = sobe meio tom
  // -1 = desce meio tom
  const [transpose, setTranspose] = useState(0);

  // controla se o auto-scroll está ativo
  const [isScrolling, setIsScrolling] = useState(false);

  // velocidade da rolagem automática
  const [scrollSpeed, setScrollSpeed] = useState(1);

  // calcula o tom atual da música
  // com base no tom original + transposição
  const currentKey = transposeKey(song.key, transpose);

  // executa a rolagem automática da página
  // enquanto o auto-scroll estiver ativo
  useEffect(() => {
    // se o scroll não estiver ativo,
    // não executa nada
    if (!isScrolling) return;

    // executa scroll continuamente
    const interval = setInterval(() => {
      // move a janela verticalmente
      window.scrollBy(0, scrollSpeed);
    }, 50);

    // limpa o interval quando:
    // - componente desmonta
    // - velocidade muda
    // - scroll para
    return () => clearInterval(interval);
  }, [isScrolling, scrollSpeed]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0f172a, #111827)",
        padding: "40px 20px",
      }}
    >
      <Stack
        p="xl"
        gap="lg"
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* título principal da aplicação */}
        <Title order={1}>Projeto Cifras</Title>

        {/* painel de controles */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* controles de tom */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Button
              size="md"
              radius="md"
              variant="light"
              onClick={() => setTranspose(transpose - 1)}
            >
              Tom -
            </Button>

            <Text size="xl" fw="bold" c="blue.3">
              {currentKey}
            </Text>

            <Button
              size="md"
              radius="md"
              variant="light"
              onClick={() => setTranspose(transpose + 1)}
            >
              Tom +
            </Button>
          </div>

          {/* scroll */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Button onClick={() => setIsScrolling(!isScrolling)}>
              {isScrolling ? "Parar" : "Scroll"}
            </Button>
          </div>

          {/* velocidade */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Button onClick={() => setScrollSpeed(scrollSpeed - 1)}>-</Button>
            <Text fw="bold" c="blue.2">
              Vel {scrollSpeed}
            </Text>
            <Button onClick={() => setScrollSpeed(scrollSpeed + 1)}>+</Button>
          </div>
        </div>

        {/* renderizador da cifra */}
        <SongViewer
          title={song.title}
          songKey={currentKey}
          content={song.content}
          transpose={transpose}
        />
      </Stack>
    </div>
  );
}

export default App;
