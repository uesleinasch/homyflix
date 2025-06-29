import { Box, Divider, Flex, Title } from "@mantine/core";

interface HeaderProps {
  title: string;

  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <>
      <Box pl={{base: "0px", sm: "md"}} pr={{base: "0px", sm: "md"}}>
        <Flex justify="space-between" wrap="wrap" align="center" p="0px" gap={{base: "xs", sm: "md"}}>
          <Box>
            <Title order={1} size="h2">
              {title}
            </Title>
          </Box>
          <Box>{children}</Box>
        </Flex>
        <Divider my="md" />
      </Box>
    </>
  );
};

export default Header;
