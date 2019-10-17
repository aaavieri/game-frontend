import React, { useState, useEffect } from "react";
import { Fab, CircularProgress } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import {makeStyles} from "@material-ui/core/styles";
import { useTimer } from "react-timer-hook";

const useStyles = makeStyles(theme => ({
    wrapper: {
        margin: theme.spacing(1),
        position: "relative",
    },
    buttonSuccess: {
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: "absolute",
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
    }
}));

export default function Timer(props) {
    const classes = useStyles();
    const [ countDown, setCountDown ] = useState(props.countDown);
    const timer = React.useRef();
    useEffect(() => {
        return () => {
            clearInterval(timer.current);
        };
    }, []);
    const {restart} = useTimer({
        expiryTimestamp: new Date().getTime() + 1000,
        onExpire: () => {
            if (countDown > 0) {
                setCountDown(countDown - 1);
                restart(new Date().getTime() + 1000);
            }
        }
    });
    return (
        <div className={classes.wrapper}>
            <Fab aria-label="save"
                 color="primary"
                 className={classes.buttonSuccess}>
                {countDown}
            </Fab>
            {countDown > 0 && <CircularProgress size={68} className={classes.fabProgress} />}
        </div>
    );
}