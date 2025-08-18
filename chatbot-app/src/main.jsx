
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { nhost } from "./config/nhost.jsx";
import { NhostProvider } from "@nhost/react";
import { BrowserRouter } from "react-router-dom";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWSClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

// ---------- HTTP link ----------
const httpLink = createHttpLink({
  uri: "https://dcthotdhgvfbsxyyguyi.hasura.ap-south-1.nhost.run/v1/graphql",
});

// Auth middleware: add token only if exists
const authLink = setContext(async (_, { headers }) => {
  const token = await nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

// ---------- WebSocket link ----------
const wsLink = new GraphQLWsLink(
  createWSClient({
    url: "wss://dcthotdhgvfbsxyyguyi.hasura.ap-south-1.nhost.run/v1/graphql",
    connectionParams: () => {
      const token = nhost.auth.getSession()?.accessToken;
      return token ? { headers: { authorization: `Bearer ${token}` } } : {};
    },
    lazy: true,
    reconnect: true,
  })
);

// ---------- Split link ----------
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// ---------- Apollo Client ----------
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// ---------- Render App ----------
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <NhostProvider nhost={nhost}>
        <ApolloProvider client={client}>
            <App />
          
        </ApolloProvider>
      </NhostProvider>
    </BrowserRouter>
  </React.StrictMode>
);
