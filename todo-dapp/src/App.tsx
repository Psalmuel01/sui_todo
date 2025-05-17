import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { Todo } from "./Todo";
// import Nft from "./Nft";
import Token from "./Token";

function App() {

  return (
    <div className="min-h-screen bg-slate-50">
      <Flex
        position="sticky"
        px="8"
        py="4"
        justify="between"
        align="center"
        style={{
          borderBottom: "2px solid var(--gray-a3)",
          // background: "white",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box>
          <Heading size="5" style={{ fontWeight: 700, color: "#3b82f6" }}>
            Sam Dapp
          </Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>


      <Container size="3" mt="6">
        <Container
          mt="6"
          pt="4"
          px="6"
          style={{
            background: "white",
            minHeight: 600,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            border: "1px solid var(--gray-a3)"
          }}
        >
          <Token />
        </Container>

        {/* <Container
          mt="6"
          pt="4"
          px="6"
          style={{
            background: "white",
            minHeight: 600,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            border: "1px solid var(--gray-a3)"
          }}
        >
          <Nft />
        </Container> */}

        <Container
          mt="6"
          pt="4"
          px="6"
          style={{
            background: "white",
            minHeight: 600,
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            border: "1px solid var(--gray-a3)"
          }}
        >
          <Todo />
        </Container>
      </Container>
    </div>
  );
}
export default App;