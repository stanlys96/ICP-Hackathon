import { useState, useEffect } from "react";
import { Actor, HttpAgent } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

const webapp_id = process.env.CANISTER_ID_TRIPLE_ENTRY_BACKEND;

// The interface of the whoami canister
const webapp_idl = ({ IDL }) => {
  return IDL.Service({ whoami: IDL.Func([], [IDL.Principal], ["query"]) });
};

export const init = ({ IDL }) => {
  return [];
};

function App() {
  const [currentIiUrl, setCurrentIiUrl] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  async function handleLogin() {
    try {
      // When the user clicks, we start the login process.
      // First we have to create and AuthClient.
      const authClient = await AuthClient.create();

      // Call authClient.login(...) to login with Internet Identity. This will open a new tab
      // with the login prompt. The code has to wait for the login process to complete.
      // We can either use the callback functions directly or wrap them in a promise.
      await new Promise((resolve, reject) => {
        authClient.login({
          identityProvider: currentIiUrl,
          onSuccess: resolve,
          onError: reject,
        });
      });

      // At this point we're authenticated, and we can get the identity from the auth client:
      const identity = authClient.getIdentity();
      // Using the identity obtained from the auth client, we can create an agent to interact with the IC.
      const agent = new HttpAgent({ identity });
      // Using the interface description of our webapp, we create an actor that we use to call the service methods.
      const webapp = Actor.createActor(webapp_idl, {
        agent,
        canisterId: "bd3sg-teaaa-aaaaa-qaaba-cai",
      });
      // Call whoami which returns the principal (user id) of the current user.
      const principal = await webapp.whoami();
      setLoginStatus(principal.toText());
    } catch (e) {
      console.log(e, "<<< ERROR");
    }
  }
  useEffect(() => {
    let iiUrl;
    if (process.env.DFX_NETWORK === "local") {
      iiUrl = `http://${process.env.CANISTER_ID}.localhost:4943`;
    } else if (process.env.DFX_NETWORK === "ic") {
      iiUrl = `https://${process.env.CANISTER_ID}.ic0.app`;
    } else {
      iiUrl = `https://${process.env.CANISTER_ID}.dfinity.network`;
    }
    setCurrentIiUrl(iiUrl);
  }, []);
  return (
    <main>
      <img src="/logo2.svg" alt="DFINITY logo" />
      <br />
      <br />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={handleLogin} type="submit">
          Login
        </button>
      </div>
      <section id="greeting">{loginStatus}</section>
      <p>{loginStatus}</p>
    </main>
  );
}

export default App;
