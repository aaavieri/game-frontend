import React, { useState, useEffect } from "react";
import { Grid, Avatar, Typography } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import PokerCard from "./PokerCard"
import Timer from "./Timer"
import {http} from "../util";

const useStyles = makeStyles({
    container: {
        width: "100%",
        height: "100%",
        flexGrow: 1,
        padding: 20
    }
});

function Inner(props) {
    const classes = useStyles();
    const { info: {userId, lordUser}, position } = props;
    const listenerName = `Other.${position}`;
    const [ cardLabel, setCardLabel ] = useState("");
    const [ otherUser, setOtherUser ] = useState("未加入");
    const [ playing, setPlaying ] = useState(false);
    useEffect(() => {
        setCardLabel("未发牌");
    });
    const [ avatarSrc, setAvatarSrc ] = useState("/asset/img/unknown.jpg");
    const getUserLabel = userId => {
        return `${userId}(${userId === lordUser ? "地主" : "农民"})`
    };
    http.addDataListener("JoinGame", listenerName, ({userList}) => {
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
    let cardCount = 0;
    http.addDataListener("StartGame", listenerName, ({ lordUser, cardList = [] }) => {
        if (lordUser === otherUser) {
            setAvatarSrc("/asset/img/lord.jpg");
        } else if (lordUser) {
            setAvatarSrc("/asset/img/farmer.jpg");
        }
        if (cardList.length > 0) {
            cardCount = cardList.length;
            setCardLabel(`${cardCount}张牌`);
        }
    });
    http.addDataListener("CallLord", listenerName, ({ lordUser, lordCards = [] }) => {
        if (lordUser === otherUser) {
            setAvatarSrc("/asset/img/lord.jpg");
            setPlaying(true);
            cardCount += lordCards.length;
        } else if (lordUser) {
            setAvatarSrc("/asset/img/farmer.jpg");
        }
        setCardLabel(`${cardCount}张牌`);
    });
    http.addDataListener("SkipPlay", listenerName, ({ nextPlayUser }) => {
        if (nextPlayUser === otherUser) {
            setPlaying(true);
        } else if (playing) {
            setPlaying(false);
        }
    });
    http.addDataListener("DoPlay", listenerName, ({ nextPlayUser, sentCard: {sentCards = []} }) => {
        if (nextPlayUser === otherUser) {
            cardCount -= sentCards.length;
            setCardLabel(`${cardCount}张牌`);
            setPlaying(true);
        } else if (playing) {
            setPlaying(false);
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
            <Grid item>
                {playing && <Timer countDown={10}/>}
            </Grid>
        </Grid>
    );
}

const Other = connect(
    state => {return {info: state.info}}
)(Inner);

export default Other;