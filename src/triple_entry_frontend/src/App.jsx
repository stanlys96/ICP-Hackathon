import { useEffect, useState } from "react";
import IC from "./utils/IC";

function App() {
  const [islog, setIslog] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    IC.getAuth(async (authClient) => {
      if (await authClient.isAuthenticated()) {
        setIslog(authClient.getIdentity().getPrincipal().toText());
      }
    });
  }, []);

  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <h1>Triple Entry Cash</h1>
      <p>Is log: {islog}</p>
      <button
        onClick={() => {
          IC.getBackend(async (be) => setGreeting(await be.greetShared()));
        }}
      >
        greet
      </button>
      <p>{greeting}</p>
      <button
        onClick={() => {
          IC.getAuth(async (authClient) => {
            authClient.logout();
          });
        }}
      >
        Logout
      </button>
      <button
        onClick={() => {
          IC.getAuth(async (authClient) => {
            authClient.login({
              ...IC.defaultAuthOption,
              onSuccess: () => {
                setIslog(authClient.getIdentity().getPrincipal().toText());
              },
            });
          });
        }}
      >
        Login
      </button>
    </main>
  );
}

export default App;
