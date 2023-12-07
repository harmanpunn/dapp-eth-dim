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
import { isAuthenticated } from "./lemon/auth_service";
import { aes } from "./lemon/encrypt";
import { generateCustomHash } from "./lemon/utils";
import { sha256 } from "node-forge";

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

  const postLogin = ()=>{
    isAuthenticated(identityContract, account).then(async (payload)=>{
      // const seed = payload["seed"];

      // const coreCIDenc = await identityContract.methods.getUserCipher().call({ from: account });
      // const coreCID = aes.decryptText(coreCIDenc, seed, account);

      // const root = await networkInterface.getFilesFromIPFSByCID(coreCID);
      // let user_metadata = await networkInterface.getFilesFromIPFSByCID(root["metadata"]["keyvalues"]["auth"]);
      
      // user_metadata = !user_metadata["metadata"]["keyvalues"] ? {} : user_metadata["metadata"]["keyvalues"];

      // if(user_metadata["shared_token"] != undefined){
      //   // there might be files in shared_token 
      //   var share_metadata = await networkInterface.getFilesFromIPFSByCID(user_metadata["shared_token"]);
      //   share_metadata = !share_metadata["metadata"]["keyvalues"] ? {} : share_metadata["metadata"]["keyvalues"];
      //   if(share_metadata["files"] != undefined){
      //     user_metadata["shared_files"] += share_metadata["files"];
      //   }
      //   await networkInterface.updateMetadatainIPFS(user_metadata["shared_token"], null)
      //   await networkInterface.deleteFileByCID(user_metadata["shared_token"]);
      // }
      // // user_metadata["shared_token"] = await networkInterface.storeJSONinIPFS({share_hash: generateCustomHash(coreCIDenc, Date.now())}, account);
      
      // await networkInterface.updateMetadatainIPFS(root["metadata"]["keyvalues"]["auth"], user_metadata);
      window.location.href = "/user-profile"
    })
  }

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
                    postLogin={postLogin}
                  />
                }
              />

              <Route
                key="main"
                path="/user-profile"
                element={<AuthGuard component={<UserProfile identityContract={identityContract} account={account}/>} identityContract={identityContract} account={account} />}
              />
              <Route
                key="login"
                path="/login"
                element={
                  <AuthComponent
                    identityContract={identityContract}
                    account={account}
                    postLogin={postLogin}
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
