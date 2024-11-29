import { useEffect, useState } from "react";
import IC from "./utils/IC";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import './index.scss';

function Dashboard() {
  const [mode, setMode] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theRole, setTheRole] = useState("");
  const [islog, setIslog] = useState("");
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
        const getRole = await result.getUserRole(
          authClient.getIdentity().getPrincipal()
        );
        const theRealRole = Object.keys(getRole?.[0])?.[0];
        setTheRole(theRealRole);
      });
    });
  }, []);

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
          <button
            onClick={() => setMode("dashboard")}
            className="the-button margin-bot"
          >
            Back
          </button>
          <p className="text-white text-center margin-bot">Transaction</p>
          <p className="text-white text-center margin-bot brown-color">
            Enter a Blockchain or Transaction/ Origin Walet Wallet address
          </p>
          <p className="text-white text-center margin-bot brown-color">
            Validating a transaction- Ensure Blockchain Address format is
            Correct to prevent errors.
          </p>
          <div className="input-master">
            <div className="input-container">
              <label className="text-white">To Wallet Address</label>
              <input className="inputy" />
            </div>
            <div className="input-container">
              <label className="text-white">Amount</label>
              <input className="inputy" />
            </div>
            <div className="input-container">
              <label className="text-white">Description</label>
              <input className="inputy" />
            </div>
            <button className="submit-button">Submit</button>
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
