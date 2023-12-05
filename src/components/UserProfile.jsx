import React, { useEffect, useState } from "react";


import FileUpload from "./FileUpload";
import Display from "./Display";
import Share from "./Share";

const UserProfile = ({ account }) => {
  
  return (
    <React.Fragment>
      <FileUpload account={account} />
    </React.Fragment>
  );
};

export default UserProfile;
