import { useState, useEffect } from "react";
import IC from "./utils/IC";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import './index.scss';

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
      }
    });
  }, []);

  return (
    <div className="the-body">
      {loading ? (
        <ClipLoader
          color={"#FFFFFF"}
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        <div className="the-body">
          <p className="text-white margin-bot">Identity: {whoami}</p>
          <p className="text-white">Choose your role:</p>
          <div className="radio-group">
            {rolesData?.map((option) => (
              <label
                key={option}
                className={`radio-label ${
                  selected === option ? "selected" : ""
                }`}
              >
                <input
                  type="radio"
                  value={option}
                  checked={selected === option}
                  onChange={handleChange}
                />
                <span className="custom-radio"></span>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>
          {confirmLoading ? (
            <BeatLoader color={"#FFFFFF"} size={30} />
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
              className="submit-button"
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
