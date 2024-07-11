import React from "react";
import { Typography } from "@mui/material";
import classes from "./styles.module.css";

const Welcome: React.FC = () => {
  
 return (
    <>
      <div className={`${classes.pageHeader} ${classes.mb2}`}>
        <Typography variant="h5">Please Log in to continue</Typography>
      </div>

    </>
  );
};

export default Welcome;
