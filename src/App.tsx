import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import {
  Button,
  Stack,
  Text,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import SongViewer from "./components/SongViewer";
import { song } from "./data/song";
import { transposeKey } from "./services/transposeKey";

function App() {
  const [transpose, setTranspose] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [fontSize, setFontSize] = useState(22);
  const currentKey = transposeKey(song.key, transpose);
  const scrollLabel =
    scrollSpeed >= 7 ? "Rápido" : scrollSpeed >= 4 ? "Médio" : "Lento";
  const scrollStatus = isScrolling ? "Ativo" : "Pause";

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

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const toolbarGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "2px 5px",
    borderRadius: "18px",
    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.42)",
    border: isDark
      ? "1px solid rgba(148,163,184,0.22)"
      : "1px solid rgba(148,163,184,0.26)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(to bottom, #0f172a, #111827)"
          : "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
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
            backdropFilter: "blur(12px)",
            backgroundColor: isDark
              ? "rgba(15,23,42,0.42)"
              : "rgba(255,255,255,0.42)",
            borderRadius: "12px",
            border: isDark
              ? "1px solid rgba(148,163,184,0.22)"
              : "1px solid rgba(148,163,184,0.32)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
          }}
        >
          {/* controles de tom */}
          <div style={toolbarGroupStyle}>
            <Button
              size="md"
              radius="md"
              variant="light"
              onClick={() => setTranspose(transpose - 1)}
            >
              Tom -
            </Button>

            <Text
              size="xl"
              fw="bold"
              style={{
                color: isDark ? "#93c5fd" : "#c4b5fd",
              }}
            >
              {currentKey}

              {transpose !== 0 && (
                <span
                  style={{
                    fontSize: "14px",
                    marginLeft: "6px",
                    opacity: isDark ? 0.7 : 1,

                    color: isDark ? "#cbd5e1" : "#94a3b8",
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
          <div style={toolbarGroupStyle}>
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

            <Button
              size="xs"
              radius="xl"
              variant="light"
              onClick={() => setScrollSpeed(Math.max(1, scrollSpeed - 1))}
            >
              ←
            </Button>

            <Text
              fw="bold"
              style={{
                color:
                  scrollSpeed >= 7
                    ? "#f87171"
                    : scrollSpeed >= 4
                      ? "#facc15"
                      : isDark
                        ? "#93c5fd"
                        : "#c4b5fd",
              }}
            >
              ⚡ {scrollSpeed}
              {" • "}
              {scrollLabel}
            </Text>

            <Button
              size="xs"
              radius="xl"
              variant="light"
              onClick={() => setScrollSpeed(Math.min(10, scrollSpeed + 1))}
            >
              →
            </Button>
          </div>

          {/* fonte */}
          <div style={toolbarGroupStyle}>
            <Button
              size="xs"
              radius="xl"
              variant="light"
              onClick={() => setFontSize((prev) => Math.max(16, prev - 2))}
            >
              A-
            </Button>

            <Text
              fw="bold"
              style={{
                color: isDark ? "#93c5fd" : "#c4b5fd",
              }}
            >
              {fontSize}
            </Text>

            <Button
              size="xs"
              radius="xl"
              variant="light"
              onClick={() => setFontSize((prev) => Math.min(40, prev + 2))}
            >
              A+
            </Button>
          </div>
          {/* tema */}
          <div style={toolbarGroupStyle}>
            <ActionIcon
              size="lg"
              radius="xl"
              variant="transparent"
              color={isDark ? "yellow" : "blue"}
              style={{
                background: "transparent",
                border: "none",
              }}
              onClick={() => toggleColorScheme()}
            >
              {isDark ? (
                <IconSun
                  size={18}
                  stroke={2}
                  color={isDark ? "#f8fafc" : "#f59e0b"}
                />
              ) : (
                <IconMoon size={18} />
              )}
            </ActionIcon>
          </div>
        </div>

        {/* renderizador da cifra */}
        <div
          style={{
            marginTop: "8px",
          }}
        >
          <SongViewer
            title={song.title}
            artist={song.artist}
            songKey={currentKey}
            content={song.content}
            transpose={transpose}
            fontSize={fontSize}
          />
        </div>
      </Stack>
    </div>
  );
}

export default App;
