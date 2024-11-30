import { useState, useEffect } from "react";
import IC from "./utils/IC";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import "./index.scss";

function Role() {
  const [selected, setSelected] = useState("");
  const [whoami, setWhoami] = useState("");
  const [identity, setIdentity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [companyRolePicked, setCompanyRolePicked] = useState(false);
  const [rolesData, setRolesData] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setSelected(event.target.value);
  };

  useEffect(() => {
    setLoading(true);
    IC.getAuth(async (authClient) => {
      if (await authClient.isAuthenticated()) {
        IC.getBackend().then(async (result) => {
          const isCompanyRolePicked = await result.isCompanyRolePicked();
          if (isCompanyRolePicked) {
            setRolesData(["Accounting", "Staff"]);
          } else {
            setRolesData(["Company", "Accounting", "Staff"]);
          }
          setCompanyRolePicked(isCompanyRolePicked);
          await result.recordPrincipal(authClient.getIdentity().getPrincipal());
          setWhoami(authClient.getIdentity().getPrincipal().toText());
          setIdentity(authClient.getIdentity().getPrincipal());
          const hasRole = await result.hasRole(
            authClient.getIdentity().getPrincipal()
          );
          if (hasRole) {
            navigate("/dashboard");
          }
          setLoading(false);
        });
      } else {
        navigate("/home");
      }
    });
  }, []);

  return (
    <div className="the-body">
      {loading ? (
        <div className="text-black loader-container">
          <ClipLoader
            color={"#000000"}
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="flex justify-center flex-col h-[100vh] w-[100vw] items-center">
          <p className="text-black margin-bot text-[24px]">Identity: {whoami}</p>
          <p className="text-black text-[20px]">Choose your role:</p>
          <div className="radio-group">
            {rolesData?.map((option) => (
              <label
                key={option}
                className={`radio-label text-black ${
                  selected === option ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  value={option}
                  checked={selected === option}
                  onChange={handleChange}
                  className="text-black"
                />
                <span className="custom-radio text-black"></span>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
          {confirmLoading ? (
            <BeatLoader color={"#000000"} size={30} />
          ) : (
            <button
              onClick={async () => {
                if (!selected) return;
                setConfirmLoading(true);
                IC.getBackend(async (result) => {
                  const roleVariant = selected;
                  const finalResult = await result.setUserRole(
                    identity,
                    roleVariant
                  );
                  if (finalResult) {
                    navigate("/dashboard");
                  }
                  setConfirmLoading(false);
                });
              }}
               className="bg-[#103580] flex items-center gap-x-2 py-[20px] px-[100px] rounded-[10px]"
            >
              Submit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Role;
