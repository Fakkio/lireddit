import {Alert, AlertDescription, AlertIcon, Box, Button, Flex, Heading, Link, Stack, Text} from "@chakra-ui/core";
import {withUrqlClient} from "next-urql";
import NextLink from "next/link";
import * as React from "react";
import {useState} from "react";
import {EditDeletePostButtons} from "../components/EditDeletePostButtons";
import {Layout} from "../components/layout";
import {UpdootSection} from "../components/UpdootSection";
import {usePostsQuery} from "../generated/graphql";
import {createUrqlClient} from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState<{
    limit: number;
    cursor: null | string;
  }>({limit: 15, cursor: null});
  const [{data, error, fetching}] = usePostsQuery({variables});

  if (error) {
    return (
      <Layout>
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Flex>
        <Heading mb={4}>Posts</Heading>
        <NextLink href="create-post">
          <Button ml="auto">Crea post</Button>
        </NextLink>
      </Flex>
      {data ? (
        <Stack spacing={8}>
          {data.posts.posts.map((post) => {
            if (!post) {
              return null;
            }
            const {id, title, textSnippet, createdAt, creator} = post;
            return (
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                borderRadius={3}
                key={id}
              >
                <Flex>
                  <UpdootSection post={post} />
                  <Box w="100%">
                    <Flex flex={1}>
                      <NextLink href={`/post/${id}`}>
                        <Link>
                          <Heading fontSize="xl">{title}</Heading>
                        </Link>
                      </NextLink>
                      <Box ml="auto">
                        <EditDeletePostButtons id={id} creatorId={creator.id} />
                      </Box>
                    </Flex>
                    <Text ml="auto">
                      {new Date(parseInt(createdAt)).toLocaleString()}
                    </Text>
                    <Text mt={2}>Scritto da {creator.username}</Text>
                    <Text mt={4}>{textSnippet}...</Text>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </Stack>
      ) : fetching ? (
        <div>Caricamento in corso...</div>
      ) : (
        <div>Errore sconosciuto</div>
      )}
      {data && data.posts.hasMore && (
        <Flex>
          <Button
            isLoading={fetching}
            mt={8}
            mx="auto"
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor:
                  data?.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
