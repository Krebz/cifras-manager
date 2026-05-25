import { useEffect, useState } from "react";
import { Button, Stack, Text, Title } from "@mantine/core";
import SongViewer from "./components/SongViewer";
import { song } from "./data/song";
import { transposeKey } from "./services/transposeKey";

function App() {
  // controla a transposição da música em semitons
  const [transpose, setTranspose] = useState(0);

  // controla se o auto-scroll está ativo
  const [isScrolling, setIsScrolling] = useState(false);

  // velocidade da rolagem automática
  const [scrollSpeed, setScrollSpeed] = useState(1);

  // calcula o tom atual da música
  const currentKey = transposeKey(song.key, transpose);

  const scrollLabel =
    scrollSpeed >= 7 ? "Rápido" : scrollSpeed >= 4 ? "Médio" : "Lento";
  const scrollStatus = isScrolling ? "Scroll ativo" : "Scroll pausado";

  // executa a rolagem automática da página
  useEffect(() => {
    // se o scroll não estiver ativo, não executa nada
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (["ArrowRight", "ArrowLeft", "Space"].includes(event.code)) {
        event.preventDefault();
      }

      // espaço = inicia/para scroll
      if (event.code === "Space") {
        setIsScrolling((prev) => !prev);
      }

      // seta para direita = aumenta velocidade
      if (event.code === "ArrowRight") {
        setScrollSpeed((prev) => Math.min(10, prev + 1));
      }

      // seta para esquerda = diminui velocidade
      if (event.code === "ArrowLeft") {
        setScrollSpeed((prev) => Math.max(1, prev - 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
            position: "sticky",
            top: "12px",
            zIndex: 1000,
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(15,23,42,0.82)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
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

              {transpose !== 0 && (
                <span
                  style={{
                    fontSize: "14px",
                    marginLeft: "6px",
                    opacity: 0.7,
                  }}
                >
                  ({transpose > 0 ? "+" : ""}
                  {transpose})
                </span>
              )}
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
            <Button
              size="md"
              radius="md"
              color={isScrolling ? "red" : "blue"}
              style={{
                fontWeight: "bold",

                boxShadow: isScrolling ? "0 0 12px rgba(255,0,0,0.6)" : "none",
              }}
              onClick={() => setIsScrolling(!isScrolling)}
            >
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
            <Button
              size="xs"
              radius="xl"
              variant="light"
              onClick={() => setScrollSpeed(Math.max(1, scrollSpeed - 1))}
            >
              -
            </Button>
            <Text
              fw="bold"
              style={{
                color:
                  scrollSpeed >= 7
                    ? "#f87171"
                    : scrollSpeed >= 4
                      ? "#facc15"
                      : "#93c5fd",
              }}
            >
              ⚡ Vel {scrollSpeed} • {scrollLabel}
            </Text>
            <Button
              size="xs"
              radius="xl"
              variant="light"
              onClick={() => setScrollSpeed(Math.min(10, scrollSpeed + 1))}
            >
              +
            </Button>
          </div>

          <Text
            fw="bold"
            style={{
              color: isScrolling ? "#4ade80" : "#94a3b8",
              opacity: isScrolling ? 1 : 0.7,
              transition: "all 0.3s ease",
            }}
          >
            ● {scrollStatus}
          </Text>
          <Text
            size="sm"
            style={{
              opacity: 0.7,
            }}
          >
            Espaço ▶ Scroll • ← → Velocidade
          </Text>
        </div>

        {/* renderizador da cifra */}
        <div
          style={{
            marginTop: "16px",
          }}
        >
          <SongViewer
            title={song.title}
            songKey={currentKey}
            content={song.content}
            transpose={transpose}
          />
        </div>
      </Stack>
    </div>
  );
}

export default App;
