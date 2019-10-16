import React, { useState, useEffect } from 'react';
import { Grid, Avatar, Typography, Fab, CircularProgress } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import {makeStyles} from '@material-ui/core/styles';
import {connect} from "react-redux";
import PokerCard from './PokerCard'
import {http} from '../util';

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
        padding: 20
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

function Inner(props) {
    const classes = useStyles();
    const { info: {userId, lordUser}, position } = props;
    const [ cardLabel, setCardLabel ] = useState("");
    const [ otherUser, setOtherUser ] = useState("未加入");
    useEffect(() => {
        setCardLabel("未发牌");
    });
    const [ avatarSrc, setAvatarSrc ] = useState("/asset/img/unknown.jpg");
    const getUserLabel = userId => {
        return `${userId}(${userId === lordUser ? "地主" : "农民"})`
    };
    http.addDataListener("JoinGame", ({userList}) => {
        if (userList.length === 2) {
            if (position === -1 && userId === userList[1]) {
                setOtherUser(getUserLabel(userList[0]));
            } else if (position === 1 && userId === userList[0]) {
                setOtherUser(getUserLabel(userList[1]));
            }
        } else if (userList.length === 3) {
            const index = userList.findIndex(userId);
            if (position === -1) {
                setOtherUser(getUserLabel(userList[(index + 2) % 3]));
            } else if (position === 1) {
                setOtherUser(getUserLabel(userList[(index + 1) % 3]));
            }
        }
    });
    http.addDataListener("StartGame", ({ lordUser, cardList = [] }) => {
        if (lordUser === userId) {
            setAvatarSrc("/asset/img/lord.jpg");
        } else if (lordUser) {
            setAvatarSrc("/asset/img/farmer.jpg");
        }
        if (cardList.length > 0) {
            setCardLabel(`${cardList.length}张牌`);
        }
    });
    return (
        <Grid container wrap="nowrap" spacing={2} className={classes.container} alignItems={"center"} justify={"center"} direction={"column"}>
            <Grid item>
                <Typography variant="button" display="block" gutterBottom>{otherUser}</Typography>
            </Grid>
            <Grid item>
                <Avatar src={avatarSrc}/>
            </Grid>
            <Grid item>
                <PokerCard cardLabel={cardLabel}/>
            </Grid>
            <Grid item alignItems={"center"} justify={"center"}>
                <div className={classes.wrapper}>
                    <Fab aria-label="save"
                         color="primary"
                         className={classes.buttonSuccess}>
                    </Fab>
                    <CircularProgress size={68} className={classes.fabProgress} />
                </div>
            </Grid>
        </Grid>
    );
}

const Other = connect(
    state => {return {info: state.info}}
)(Inner);

export default Other;