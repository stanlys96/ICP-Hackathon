import { useEffect, useState } from "react";
import IC from "./utils/IC";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import Swal from "sweetalert2";

function Dashboard() {
  const numberStrings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const [mode, setMode] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theRole, setTheRole] = useState("");
  const [islog, setIslog] = useState("");
  const [currentPrincipal, setCurrentPrincipal] = useState();
  const [principals, setPrincipals] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState();
  const [transactionLoading, setTransactionLoading] = useState(false);
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
    setLoading(true);
    IC.getAuth(async (authClient) => {
      if (await authClient.isAuthenticated()) {
        setIslog(authClient.getIdentity().getPrincipal().toText());
        setCurrentPrincipal(authClient.getIdentity().getPrincipal());
      }
      IC.getBackend(async (result) => {
        await result.recordPrincipal(authClient.getIdentity().getPrincipal());
        const getRole = await result.getUserRole(
          authClient.getIdentity().getPrincipal()
        );
        const getPrincipals = await result.getAllPrincipals();
        const uniqueData = getPrincipals.filter(
          (item, index, self) =>
              self.findIndex(other => other?.toText() === item?.toText()) === index
        );
        const principalsWithRoles = await Promise.all(
          uniqueData?.map(async (principal) => ({
            principal: principal,
            principalText: principal?.toText(),
            role: Object.keys((await result.getUserRole(principal))?.[0] ?? {})?.[0],
          }))
        );
        setPrincipals(principalsWithRoles);
        const theRealRole = Object.keys(getRole?.[0] ?? {})?.[0];
        setTheRole(theRealRole);
        const transactions = await result.getTransactions();
        console.log(transactions, "<<< TRANSACTIONS")
        setLoading(false);
      });
    });
  }, []);

  return (
    <main className="the-body">
      {loading ? <ClipLoader
          color={"#FFFFFF"}
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        /> : <div>
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
              <select value={destination} onChange={(e) => setDestination(e.target.value)} className="inputy" id="dropdown" name="options">
                <option>Select destination</option>
                {principals?.map(
                  (principal) =>
                    islog !== principal?.principalText && (
                      <option value={principal?.principal}>{principal?.principalText?.slice(0, 25) + "..."} -{" "}{principal?.role}</option>
                    )
                )}
              </select>
            </div>
            <div className="input-container">
              <label className="text-white">Amount</label>
              <input value={amount} onChange={(e) => {
                let currentValue = e.target.value;
                const filteredValue = currentValue
                  .split("")
                  .filter((char) => numberStrings.includes(char))
                  .join("");
                setAmount(filteredValue);
              }} className="inputy" />
            </div>
            <div className="input-container">
              <label className="text-white">Description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} className="inputy" />
            </div>
            {transactionLoading ? <div className="center-all">
                <BeatLoader color={"#FFFFFF"} size={30} />
              </div> : <div className="button-container">
              <button
                onClick={() => setMode("dashboard")}
                className="the-button"
              >
                Cancel
              </button>
              <button onClick={() => {
                if (!destination || !amount || !description) {
                  return Swal.fire({
                    title: "Fill the values!",
                    text: "Please fill in all the inputs!",
                    icon: "info"
                  });
                }
                if (parseInt(amount) === 0) {
                  return Swal.fire({
                    title: "Amount info!",
                    text: "Amount cannot be zero!",
                    icon: "info"                    
                  })
                }
                setTransactionLoading(true);
                IC.getBackend(async(result) => {
                  const destinationPrincipal = principals?.find((thePrincipal) => thePrincipal?.principalText === destination)?.principal;
                  const finalResult = await result.addTransaction(currentPrincipal, destinationPrincipal, parseInt(amount), description);
                  console.log(finalResult, "<<< FINAL RESULT");
                  setAmount("");
                  setDescription("");
                  setDestination("");
                  setTransactionLoading(false);
                  Swal.fire({
                    title: "Success!",
                    text: "Successfully created the transaction!",
                    icon: "success"
                  });
                })
              }} className="submit-button">Submit</button>
            </div>}
          </div>
        </div>
      )}
      </div>}
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
