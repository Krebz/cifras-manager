import { useEffect, useState } from "react"

import {
  Button,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core"

// componente responsável por renderizar a cifra
import SongViewer from "./components/SongViewer"

// música mockada utilizada inicialmente no projeto
import { song } from "./data/song"

// função responsável por calcular o tom atual
import { transposeKey } from "./services/transposeKey"

function App() {
  // controla a transposição da música em semitons
  // exemplo:
  // 0 = tom original
  // +1 = sobe meio tom
  // -1 = desce meio tom
  const [transpose, setTranspose] = useState(0)

  // controla se o auto-scroll está ativo
  const [isScrolling, setIsScrolling] =
    useState(false)

  // velocidade da rolagem automática
  const [scrollSpeed, setScrollSpeed] =
    useState(1)

  // calcula o tom atual da música
  // com base no tom original + transposição
  const currentKey = transposeKey(
    song.key,
    transpose
  )

  // executa a rolagem automática da página
  // enquanto o auto-scroll estiver ativo
  useEffect(() => {
    // se o scroll não estiver ativo,
    // não executa nada
    if (!isScrolling) return

    // executa scroll continuamente
    const interval = setInterval(() => {
      // move a janela verticalmente
      window.scrollBy(0, scrollSpeed)
    }, 50)

    // limpa o interval quando:
    // - componente desmonta
    // - velocidade muda
    // - scroll para
    return () => clearInterval(interval)
  }, [isScrolling, scrollSpeed])

  return (
    <Stack p="md">
      {/* título principal da aplicação */}
      <Title order={1}>
        Projeto Cifras
      </Title>

      {/* painel de controles */}
      <Group>
      
        {/* diminuir tom */}
        <Button onClick={() => setTranspose(transpose - 1) } >
          Tom -
        </Button>

        {/* exibe tom atual */}
        <Text size="lg"> Tom: {currentKey} </Text>

        {/* aumentar tom */}
        <Button onClick={() => setTranspose(transpose + 1) } > 
          Tom + 
        </Button>

        {/* iniciar/parar auto-scroll */}
        <Button onClick={() => setIsScrolling(!isScrolling) } >
          {isScrolling ? "Parar" : "Scroll"}
        </Button>

        {/* diminuir velocidade */}
        <Button onClick={() => setScrollSpeed(scrollSpeed - 1) } >
          -
        </Button>

        {/* velocidade atual */}
        <Text>
          Velocidade: {scrollSpeed}
        </Text>

        {/* aumentar velocidade */}
        <Button onClick={() => setScrollSpeed(scrollSpeed + 1) } >
          +
        </Button>
      
      </Group>

      {/* renderizador da cifra */}
      <SongViewer
        title={song.title}
        content={song.content}
        transpose={transpose}
      />
    </Stack>
  )
}

export default App