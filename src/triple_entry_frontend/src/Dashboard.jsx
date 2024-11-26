import { useEffect, useState } from "react";
import IC from "./utils/IC";
import { useNavigate } from "react-router-dom";
import { Modal, Select } from "antd";

function Dashboard() {
  const [mode, setMode] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theRole, setTheRole] = useState("");
  const [islog, setIslog] = useState("");
  const [principals, setPrincipals] = useState([]);
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    IC.getAuth(async (authClient) => {
      const result = await authClient.logout();
      navigate("/");
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    IC.getAuth(async (authClient) => {
      if (await authClient.isAuthenticated()) {
        setIslog(authClient.getIdentity().getPrincipal().toText());
      }
      IC.getBackend(async (result) => {
        result.recordPrincipal(authClient.getIdentity().getPrincipal());
        const getRole = await result.getUserRole(
          authClient.getIdentity().getPrincipal()
        );
        const getPrincipals = await result.getAllPrincipals();
        const principalsWithRoles = await Promise.all(
          getPrincipals?.map(async (principal) => ({
            principal: principal,
            principalText: principal?.toText(),
            role: Object.keys((await result.getUserRole(principal))?.[0])?.[0],
          }))
        );
        setPrincipals(principalsWithRoles);
        const theRealRole = Object.keys(getRole?.[0])?.[0];
        setTheRole(theRealRole);
      });
    });
  }, []);
  console.log(principals, "<< PRINCIPALS");
  useEffect(() => {
    if (islog) {
    }
  }, [islog]);
  return (
    <main className="the-body">
      {mode === "dashboard" && (
        <div className="container">
          <button
            onClick={async () => {
              showModal(true);
            }}
            className="the-button margin-bot"
          >
            Logout
          </button>
          <p className="text-white text-center margin-bot">
            Welcome to JASR Blockchain Dashboard
          </p>
          <p className="text-white text-center margin-bot">
            Your Petty Cash Summary
          </p>
          <p className="text-white text-center margin-bot">Identity: {islog}</p>
          <p className="text-white text-center margin-bot">Role: {theRole}</p>
          <button
            onClick={async () => {
              setMode("transaction");
            }}
            className="submit-button margin-bot"
          >
            Add New Transaction
          </button>
        </div>
      )}
      {mode === "transaction" && (
        <div className="transaction">
          <p className="text-white text-center margin-bot">Transaction</p>
          <p className="text-white text-center brown-color">
            Enter a Blockchain or Transaction/ Origin Walet Wallet address
          </p>
          <p className="text-white text-center margin-bot brown-color">
            Validating a transaction- Ensure Blockchain Address format is
            Correct to prevent errors.
          </p>
          <div className="input-master">
            <div className="input-container">
              <label className="text-white">From Wallet Address</label>
              <input value={islog} disabled className="disabled-inputy" />
            </div>
            <div className="input-container">
              <label className="text-white">To Wallet Address</label>
              <Select
                className="inputy text-white"
                placeholder="Pick Destination Wallet"
              >
                {principals?.map(
                  (principal) =>
                    islog !== principal?.principal && (
                      <Select.Option value={principal?.principal}>
                        {principal?.principalText?.slice(0, 25) + "..."} -{" "}
                        {principal?.role}
                      </Select.Option>
                    )
                )}
              </Select>
            </div>
            <div className="input-container">
              <label className="text-white">Amount</label>
              <input className="inputy" />
            </div>
            <div className="input-container">
              <label className="text-white">Description</label>
              <input className="inputy" />
            </div>
            <div className="button-container">
              <button
                onClick={() => setMode("dashboard")}
                className="the-button"
              >
                Cancel
              </button>
              <button className="submit-button">Submit</button>
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Logout"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </main>
  );
}

export default Dashboard;
