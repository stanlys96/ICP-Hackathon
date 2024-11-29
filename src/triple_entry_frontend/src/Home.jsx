import { useEffect, useState } from "react";
import IC from "./utils/IC";
import { useNavigate } from "react-router-dom";
import './index.scss';

function Home() {
  const [islog, setIslog] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    IC.getAuth(async (authClient) => {
      if (await authClient.isAuthenticated()) {
        setIslog(authClient.getIdentity().getPrincipal().toText());
      }
    });
  }, []);

  useEffect(() => {
    if (islog) {
      navigate("/role");
    }
  }, [islog]);

  return (
    <main className="the-body">
      <div className="container">
        <p className="text-white text-center">
          Explore the Petty Cash System Enhanced by Blockchain Tech
        </p>
        <p className="text-white text-center petty">
          "An advanced, transparent, and secure petty cash system. Control your
          transactions using cutting-edge blockchain tech."
        </p>
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
          className="the-button"
        >
          Connect Your Wallet Here
        </button>
      </div>
    </main>
  );
}

export default Home;
