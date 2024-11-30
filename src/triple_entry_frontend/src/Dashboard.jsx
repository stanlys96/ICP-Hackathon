import React, { useEffect, useState, useMemo } from "react";
import IC from "./utils/IC";
import { useNavigate } from "react-router-dom";
import { icp2 } from "./assets";
import { Modal, Table } from "antd";
import ClipLoader from "react-spinners/ClipLoader";
import BeatLoader from "react-spinners/BeatLoader";
import Swal from "sweetalert2";
import { DatePicker, Input, notification, Layout, Radio, Space, Select } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  HomeOutlined,
  TransactionOutlined,
  LogoutOutlined,
  RetweetOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';
import "./index.scss";

const { Header, Content, Footer, Sider } = Layout;

const { RangePicker } = DatePicker;

function getItem(
  label,
  key,
  icon,
  children,
) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Option 1', '1', <PieChartOutlined />),
  getItem('Option 2', '2', <DesktopOutlined />),
];


function formatCurrency(value, currencyCode = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    currency: currencyCode,
  }).format(value);
}

function Dashboard() {
  const numberStrings = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const [mode, setMode] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openAddBalance, setOpenAddBalance] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theRole, setTheRole] = useState("");
  const [islog, setIslog] = useState("");
  const [currentPrincipal, setCurrentPrincipal] = useState();
  const [principals, setPrincipals] = useState([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [destination, setDestination] = useState();
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionsResult, setTransactionsResult] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [currentICPPrice, setCurrentICPPrice] = useState(0);
  const [currentBalance, setCurrentBalance] = useState("");
  const [addingBalance, setAddingBalance] = useState("");
  const [showNotif, setShowNotif] = useState(false);
  const [theRecipient, setTheRecipient] = useState("");
  const [filterDay, setFilterDay] = useState(-1);
  const [filterModal, setFilterModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [expenses, setExpenses] = useState("");

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "counter",
      key: "counter",
      render: (counter) => counter.toString(),
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      render: (sender) => sender.toText().slice(0, 15) + "...",
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      render: (receiver) => receiver.toText().slice(0, 15) + "...",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => <p className="text-[#00CE07]">Verified</p>,
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => `Rp ${formatCurrency(value.toString())}`,
    },
    {
      title: "Description",
      dataIndex: "purpose",
      key: "purpose",
    },
  ];

  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleFilterModalOk = () => {
    setFilterModal(false);
  }
  const handleFilterModalCancel = () => {
    setFilterModal(false);
  }
  const handleTransactionModalOk = () => {
    if (!destination || !amount || !description) {
      return Swal.fire({
        title: "Fill the values!",
        text: "Please fill in all the inputs!",
        icon: "info",
      });
    }
    if (parseInt(amount) === 0) {
      return Swal.fire({
        title: "Amount info!",
        text: "Amount cannot be zero!",
        icon: "info",
      });
    }
    setTransactionLoading(true);
    IC.getBackend(async (result) => {
      try {
        const destinationPrincipal = principals?.find(
          (thePrincipal) =>
            thePrincipal?.principalText === destination
        )?.principal;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(
          2,
          "0"
        );
        const date = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(
          2,
          "0"
        );
        const minutes = String(now.getMinutes()).padStart(
          2,
          "0"
        );
        const seconds = String(now.getSeconds()).padStart(
          2,
          "0"
        );

        const formattedDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
        const finalResult = await result.addTransaction(
          currentPrincipal,
          destinationPrincipal,
          parseInt(amount),
          description,
          formattedDateTime
        );
        setAmount("");
        setDescription("");
        setDestination("");
        setTransactionLoading(false);
        Swal.fire({
          title: "Success!",
          text: "Successfully created the transaction!",
          icon: "success",
        });
        const transactions = await result.getTransactions();
        setTransactionsResult(transactions);
        const theBalance = await result.getBalance();
        setCurrentBalance(theBalance?.toString());
        const theExpenses = await result.getExpenses();
        setExpenses(theExpenses?.toString());
        setTransactionModal(false);
      } catch (e) {
        Swal.fire({
          title: "Error!",
          text: "Insufficient balance!",
          icon: "error",
        });
        setTransactionLoading(false);
      }
    });
  }
  const handleTransactionModalCancel = () => {
    setTransactionModal(false);
  }
  const handleOk = () => {
    IC.getAuth(async (authClient) => {
      const result = await authClient.logout();
      navigate("/");
    });
  };

  const handleAddBalanceOk = () => {
    try {
      if (parseInt(addingBalance) <= 0) {
        return Swal.fire({
          title: "Error!",
          text: "Amount must be more than 0!",
          icon: "error",
        });
      }
      setConfirmLoading(true);
      IC.getBackend(async (result) => {
        try {
          const theBal = await result.addBalance(
            parseInt(addingBalance ?? "0"),
            currentPrincipal
          );
          setCurrentBalance(theBal?.toString());
          setAddingBalance("");
          setOpenAddBalance(false);
          setShowNotif(true);
          setConfirmLoading(false);
          const theExpenses = await result.getExpenses();
          setExpenses(theExpenses?.toString());
          setTimeout(() => {
            setShowNotif(false);
          }, 0);
        } catch (e) {
          Swal.fire({
            title: "Error!",
            text: "Error!",
            icon: "error",
          });
          setConfirmLoading(false);
        }
      });
    } catch (e) {
      Swal.fire({
        title: "Error!",
        text: "Error!",
        icon: "error",
      });
      setConfirmLoading(false);
    }
  };

  const handleAddBalanceCancel = () => {
    setOpenAddBalance(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onOk = (value) => {
    setDateRange(value);
  };
  
  function filterBasedOnDays(data) {
    if (filterDay !== -1) {
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - filterDay);
      if (theRecipient) {
        return data.filter(item => item?.receiver?.toText()?.toLowerCase().includes(theRecipient?.toLowerCase())).filter(item => {
          const currentDate = new Date(item.timestamp);
          return currentDate >= sevenDaysAgo && currentDate <= now;
        });   
      } else {
        return data.filter(item => {
          const currentDate = new Date(item.timestamp);
          return currentDate >= sevenDaysAgo && currentDate <= now;
        });   
      }
    } else {
      if (theRecipient) {
        return data.filter(item => item?.receiver?.toText()?.toLowerCase().includes(theRecipient?.toLowerCase()));
      } else {
        return data;
      }
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=idr&ids=internet-computer"
    ).then(async (priceRes) => {
      const theRes = await priceRes.json();
      setCurrentICPPrice(theRes?.[0]?.current_price);
    });
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
        const theBalance = await result.getBalance();
        setCurrentBalance(theBalance?.toString());
        const theExpenses = await result.getExpenses();
        setExpenses(theExpenses?.toString());
        const getPrincipals = await result.getAllPrincipals();
        const uniqueData = getPrincipals.filter(
          (item, index, self) =>
            self.findIndex((other) => other?.toText() === item?.toText()) ===
            index
        );
        const principalsWithRoles = await Promise.all(
          uniqueData?.map(async (principal) => ({
            principal: principal,
            principalText: principal?.toText(),
            role: (await result.getUserRole(principal))?.[0],
          }))
        );
        setPrincipals(principalsWithRoles);
        const theRealRole = getRole?.[0];
        setTheRole(theRealRole);
        const transactions = await result.getTransactions();
        setTransactionsResult(transactions);
        setLoading(false);
      });
    });
  }, []);
  useEffect(() => {
    if (showNotif) {
      notification.success({
        message: "Success!",
        description: "You have successfully added your balance!",
      });
    }
  }, [showNotif]);
  return (
    <main className="the-body">
      <div>
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
        <div className="flex gap-x-2 flex-1">
          <div className="flex flex-col sidebar gap-y-2">
            <p className="text-black p-[15px] font-bold text-[24px]">Triple Entry</p>
            <div onClick={() => setMode("dashboard")} className={`row-entry flex gap-x-2 ${mode === "dashboard" ? "text-white bg-[#103580]" : "text-black bg-[#FFFFFF]"} cursor-pointer`}>
              <HomeOutlined />
              <p>Dashboard</p>
            </div>
            <div onClick={() => setMode("transaction")} className={`row-entry flex gap-x-2 ${mode === "transaction" ? "text-white bg-[#103580]" : "text-black bg-[#FFFFFF]"} cursor-pointer`}>
              <TransactionOutlined />
              <p>Transactions</p>
            </div>
          </div>
          {mode === "dashboard" && (
            <div className="container">
              <div className="flex justify-between items-center w-full mt-[15px]">
                <p className="text-black text-[24px]">Dashboard</p>
                <div className="flex gap-x-2">
                  <button onClick={() => showModal(true)} className="bg-[#103580] flex items-center gap-x-2 py-[10px] px-[20px] rounded-[10px]">
                    <LogoutOutlined />Log Out
                  </button>
                  <button className="border border-[#103580] bg-white text-black flex items-center gap-x-2 py-[10px] px-[20px] rounded-[10px]">
                    <RetweetOutlined />Refresh
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 w-full gap-[15px] my-[20px]">
                <div className="gradient-container flex flex-col gap-y-3 rounded-[10px] px-[15px] py-[30px]">
                  <p className="text-white"><MoneyCollectOutlined /> Balance</p>
                  <p className="text-white text-[24px]">Rp {formatCurrency(currentBalance ?? "0")}</p>
                </div>
                <div className="flex flex-col bg-white border border-[#00000025] gap-y-3 rounded-[10px] px-[15px] py-[30px]">
                  <p className="text-black"><PayCircleOutlined /> Today's Expenses</p>
                  <p className="text-black text-[24px]">Rp {formatCurrency(expenses ?? "0")}</p>
                </div>
                <div className="flex bg-white border border-[#00000025] flex-col justify-start items-center gap-y-3 rounded-[10px] px-[15px] py-[30px]">
                  <div className="flex gap-x-2 items-center">
                    <img className="w-[55px] h-[39px]" src={icp2} />
                    <p className="text-black"> Convert Currency</p>
                  </div>
                  <p className="text-black text-[24px]">1 ICP = Rp {formatCurrency(currentICPPrice?.toFixed(2))}</p>
                </div>
              </div>
              <div className="gradient-container flex flex-col gap-y-5 rounded-[10px] px-[15px] py-[25px] mb-[20px]">
                <img className="w-[55px] h-[39px]" src={icp2} />
                <div className="bg-white flex flex-col gap-y-2 border border-[#00000025] rounded-[10px] p-[10px]">
                  <div>
                    <p className="text-black">Address</p>
                    <p className="text-black">{islog}</p>
                  </div>
                  <div>
                    <p className="text-black">Role</p>
                    <p className="text-black">{theRole}</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white border-top-only px-[15px] py-[10px] flex justify-between items-center">
                <p className="text-black font-bold text-[20px]">Transactions History</p>
                <div className="flex gap-x-2 items-center">
                  <div onClick={() => setFilterModal(true)} className="text-black flex gap-x-2 items-center cursor-pointer rounded-[10px] border border-[#00000025] p-[10px]">
                    <FilterOutlined />
                    <p>Filter</p>
                  </div>
                  <input value={theRecipient} onChange={(e) => setTheRecipient(e.target.value)} type="text" className="bg-[#F5F5F5] text-black no-focus rounded-[10px] p-[10px]" placeholder="Search by recipient" />
                </div>
              </div>
              <Table
                className="w-full custom-table"
                dataSource={filterBasedOnDays(transactionsResult)}
                columns={columns}
                style={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
              />
            </div>
          )}
          {mode === "transaction" && (
            <div className="container">
              <div className="flex justify-between items-center w-full mt-[15px]">
                <p className="text-black text-[24px]">Transactions</p>
                <div className="flex gap-x-2">
                  {theRole === "Company" && <button onClick={() => setOpenAddBalance(true)} className="border border-[#103580] bg-white text-black flex items-center gap-x-2 py-[10px] px-[20px] rounded-[10px]">
                    <RetweetOutlined />Add Balance
                  </button>}
                  <button onClick={() => setTransactionModal(true)} className="bg-[#103580] flex items-center gap-x-2 py-[10px] px-[20px] rounded-[10px]">
                    <LogoutOutlined />New Transaction
                  </button>
                  <button className="border border-[#103580] bg-white text-black flex items-center gap-x-2 py-[10px] px-[20px] rounded-[10px]">
                    <RetweetOutlined />Refresh
                  </button>
                </div>
              </div>
              <div className="w-full bg-white border-top-only px-[15px] py-[10px] flex justify-between items-center mt-[20px]">
                <p className="text-black font-bold text-[20px]">Transactions History</p>
                <div className="flex gap-x-2 items-center">
                  <div onClick={() => setFilterModal(true)} className="text-black flex gap-x-2 items-center cursor-pointer rounded-[10px] border border-[#00000025] p-[10px]">
                    <FilterOutlined />
                    <p>Filter</p>
                  </div>
                  <input value={theRecipient} onChange={(e) => setTheRecipient(e.target.value)} type="text" className="bg-[#F5F5F5] text-black no-focus rounded-[10px] p-[10px]" placeholder="Search by recipient" />
                </div>
              </div>
              <Table
                className="w-full custom-table"
                dataSource={filterBasedOnDays(transactionsResult)}
                columns={columns}
                style={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                }}
              />
            </div>
          )}
          {mode === "transaction-history" && (
            <div className="table-container">
              <p className="text-white margin-bot">Filter based on timestamp</p>
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onChange={(value, dateString) => {
                  console.log("Selected Time: ", value);
                  console.log("Formatted Selected Time: ", dateString);
                }}
                className="range-picker"
                onOk={onOk}
              />
              <div className="w-full">
                <p>Transactions History</p>
              </div>
              <Table
                dataSource={filterBasedOnDays(transactionsResult)}
                columns={columns}
              />
              <button
                onClick={() => {
                  setMode("dashboard");
                  setDateRange([]);
                }}
                className="the-button"
              >
                Back
              </button>
            </div>
          )}
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
      <Modal
        title="Filter"
        open={filterModal}
        onOk={handleFilterModalOk}
        onCancel={handleFilterModalCancel}
        okText="Yes"
        cancelText="No"
      >
        <Radio.Group onChange={(e) => setFilterDay(e.target.value)} value={filterDay}>
          <Space direction="vertical">
            <Radio value={-1}>None</Radio>
            <Radio value={1}>Last 1 day</Radio>
            <Radio value={7}>Last 7 days</Radio>
            <Radio value={30}>Last 30 days</Radio>
            <Radio value={365}>Last 365 days</Radio>
          </Space>
        </Radio.Group>
      </Modal>
      <Modal
        title="Add Balance"
        open={openAddBalance}
        onOk={handleAddBalanceOk}
        confirmLoading={confirmLoading}
        onCancel={handleAddBalanceCancel}
      >
        <Input
          value={addingBalance}
          onChange={(e) => {
            const filteredValue = e.target.value
              .split("")
              .filter((char) => numberStrings.includes(char))
              .join("");
            setAddingBalance(filteredValue);
          }}
          placeholder="Input amount"
        />
      </Modal>
      <Modal
        title="Transaction"
        open={transactionModal}
        confirmLoading={transactionLoading}
        onOk={handleTransactionModalOk}
        onCancel={handleTransactionModalCancel}
        okText="Yes"
        cancelText="No"
      >
        <div className="flex flex-col gap-y-2">
          <p>Sender</p>
          <Input value={islog} disabled />
          <p>Recipient</p>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input-select"
            id="dropdown"
            name="options"
          >
            <option>Select destination</option>
            {principals?.map(
              (principal) =>
                islog !== principal?.principalText && (
                  <option value={principal?.principal}>
                    {principal?.principalText?.slice(0, 25) + "..."} -{" "}
                    {principal?.role}
                  </option>
                )
            )}
          </select>
          <p>Amount</p>
          <Input value={amount}                     
            onChange={(e) => {
              let currentValue = e.target.value;
              const filteredValue = currentValue
                .split("")
                .filter((char) => numberStrings.includes(char))
                .join("");
              setAmount(filteredValue);
            }} 
          />
          <p>Description</p>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </Modal>
      </div>
    </main>
  );
}

export default Dashboard;
