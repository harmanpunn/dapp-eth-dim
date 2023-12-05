import React, { useState, useEffect } from "react";
import "./App.css";

import web3 from "./etherium/web3";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import TaskList from "./components/TaskList";
import IdentityForm from "./components/IdentityForm";

import TodoListABI from "./abis/TodoList.json";
import IdentityMangementABI from "./abis/IdentityManagement.json";
import AuthComponent from "./components/AuthComponent";

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import AuthGuard from "./lemon/auth_guard";
import Protected from "./components/Protected";
import LemonLogin from "./lemon/Login";
import networkInterface from "./utils/ipfs";
import UserProfile from "./components/UserProfile";

function App() {
  const [account, setAccount] = React.useState("");
  const [taskContract, setTaskContract] = React.useState(null); // [1
  const [taskCount, setTaskCount] = React.useState(0);
  const [tasks, setTasks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [helia, setHelia] = React.useState(null);
  const [fs, setFs] = React.useState(null);

  const [identityContract, setIdentityContract] = React.useState(null); // [1

  const loadTasks = async (todoList) => {
    console.log("Inside loadTasks");
    if (!todoList) {
      return;
    }
    setLoading(true);
    const updatedTaskCount = await todoList.methods.taskCount().call();

    setTaskCount(updatedTaskCount);

    const updatedTasks = [];
    for (let i = 1; i <= updatedTaskCount; i++) {
      const task = await todoList.methods.tasks(i).call();
      updatedTasks.push({
        id: Number(task[0]),
        content: task[1],
        completed: task[2],
      });
    }
    console.log(updatedTasks);
    setTasks(updatedTasks);
    setLoading(false);
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const todoListData = TodoListABI.networks[networkId];
      if (todoListData) {
        const todoList = new web3.eth.Contract(
          TodoListABI.abi,
          todoListData.address
        );

        await loadTasks(todoList);
        console.log("todoList", todoList);
        setTaskContract(todoList);
      } else {
        window.alert("TodoList contract not deployed to detected network.");
      }

      const identityManagementData = IdentityMangementABI.networks[networkId];
      if (identityManagementData) {
        const identityManagement = new web3.eth.Contract(
          IdentityMangementABI.abi,
          identityManagementData.address
        );
        console.log("identityManagement", identityManagement);
        setIdentityContract(identityManagement);
      } else {
        window.alert(
          "IdentityManagement contract not deployed to detected network."
        );
      }

      setLoading(false);
    };

    loadBlockchainData();
  }, []);


  return (
    <div className="App">
      <Navbar account={account} />
      {loading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <BrowserRouter>
            <Routes>
              <Route
                key="main"
                path="/"
                element={
                  <AuthComponent
                    identityContract={identityContract}
                    account={account}
                    postLogin={()=>{window.location.href = "/user-profile"}}
                  />
                }
              />

              <Route
                key="main"
                path="/user-profile"
                element={<AuthGuard component={<UserProfile />} identityContract={identityContract} account={account} />}
              />
              <Route
                key="login"
                path="/login"
                element={
                  <AuthComponent
                    identityContract={identityContract}
                    account={account}
                  />
                }
              />
              <Route
                key="protected"
                path="/protected"
                element={
                  <AuthGuard
                    component={<Protected />}
                    identityContract={identityContract}
                    account={account}
                  />
                }
              />
            </Routes>
          </BrowserRouter>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
