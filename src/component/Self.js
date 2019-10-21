import React, { useState, useEffect } from "react";
import { Grid, Avatar, Typography, Button } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import PokerCard from "./PokerCard"
import Timer from "./Timer"
import {http, helper} from "../util";

const useStyles = makeStyles(theme => ({
    container: {
        width: "100%",
        height: "100%",
        flexGrow: 1,
        padding: 0,
        paddingLeft: 20,
        paddingRight: 20
    },
    leftArea: {
        height: "100%",
        flexGrow: 0
    },
    rightArea: {
        height: "100%",
        flexGrow: 1
    },
    cardContainer: {
        width: "100%",
        height: "100%",
        padding: 20
    },
    userContainer: {
        width: "100%",
        height: "100%",
        padding: 5
    },
    operationButton: {
        margin: theme.spacing(1),
    },
}));

function Inner(props) {
    const classes = useStyles();
    const { info: {userId, gameId, lordUser, gameStatus, userStatus}, position } = props;
    const [ userLabel, setUserLabel ] = useState(helper.getUserLabel(userId, lordUser));
    const listenerName = `Other.${position}`;
    const [ cards, setCards ] = useState([{
        label: "未发牌",
        clickEvent: () => {},
        gameIndex: -1,
        selected: false
    }]);
    const [ playing, setPlaying ] = useState(false);
    const [ avatarSrc, setAvatarSrc ] = useState("/asset/img/unknown.jpg");
    const [ canStart, setCanStart ] = useState(false);
    // const getUserLabel = userId => {
    //     return `${userId}(${userId === lordUser ? "地主" : "农民"})`
    // };
    const transferCard = card => ({
        label: card.cardPojo.label,
        selected: false,
        colorId: card.cardPojo.colorId,
        point: card.cardPojo.point,
        gameIndex: card.gameIndex,
        lordCard: card.lordCard,
        clickEvent: selectCard.bind(this, card)
    });
    const setAvatar = (lordUser) => {
        if (lordUser === userId) {
            setAvatarSrc("/asset/img/lord.jpg");
        } else if (lordUser) {
            setAvatarSrc("/asset/img/farmer.jpg");
        } else {
            setAvatarSrc("/asset/img/unknown.jpg");
        }
    };
    http.addDataListener("JoinGame", listenerName, ({ userList = [] }) => {
        if (userList.length === 3) {
            setCanStart(true);
        }
    });
    http.addDataListener("StartGame", listenerName, ({ lordUser, cardList = [] }) => {
        setAvatar(lordUser);
        setUserLabel(helper.getUserLabel(userId, lordUser));
        if (cardList && cardList.length > 0) {
            setCards(cardList.map(transferCard));
        }
    });
    http.addDataListener("CallLord", listenerName, ({ lordUser, lordCards = [] }) => {
        setAvatar(lordUser);
        setUserLabel(helper.getUserLabel(userId, lordUser));
        setPlaying(true);
        setCards(...cards, ...(lordCards.map(transferCard)));
    });
    http.addDataListener("SkipPlay", listenerName, ({ nextPlayUser }) => {
        if (nextPlayUser === userId) {
            setPlaying(true);
        } else if (playing) {
            setPlaying(false);
        }
    });
    http.addDataListener("DoPlay", listenerName, ({ nextPlayUser, sentCard: {sentCards = []} }) => {
        if (nextPlayUser === userId) {
            setPlaying(true);
        } else if (playing) {
            setCards(cards.filter(card => sentCards.findIndex(sentCard => card.gameId === sentCard.gameIndex) < 0));
            setPlaying(false);
        }
    });
    const selectCard = card => {
        if (!playing) {
            return;
        }
        card.selected = !card.selected;
    };
    const startGame = async () => {
        const {success} = await http.startGame({userId, gameId});
        if (success) {
            setCanStart(false);
        }
    };
    return (
        <Grid container wrap="nowrap" spacing={2} className={classes.container} alignItems={"flex-start"} justify={"center"} direction={"row"}>
            <Grid item className={classes.leftArea}>
                <Grid container className={classes.userContainer} wrap="nowrap" spacing={2} alignItems={"center"} justify={"center"} direction={"column"}>
                    <Grid item>
                        <Typography variant="caption" display="block" gutterBottom>{userLabel}</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar src={avatarSrc}/>
                    </Grid>
                    <Grid item>
                        {playing && <Timer countDown={10}/>}
                    </Grid>
                    <Grid item>
                        {
                            gameStatus === "WAITING_START" &&
                            <Button variant="contained" color="primary" className={classes.operationButton} onClick={startGame} disabled={!canStart}>
                                开始
                            </Button>
                        }
                        {
                            gameStatus === "WAITING_LORD" && userStatus === "WAITING_SELF_LORD" &&
                            <Button variant="contained" color="secondary" className={classes.operationButton} onClick={startGame} disabled={!canStart}>
                                叫地主
                            </Button>
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className={classes.rightArea}>
                <Grid container wrap="wrap" spacing={2} className={classes.cardContainer} alignItems={"center"} justify={"flex-start"} direction={"row"}>
                    {/*<PokerCard cardLabel={"未发牌"}/>*/}
                    {cards.map(card => (
                        <PokerCard cardLabel={card.label} onClick={card.clickEvent} selected={card.selected} key={card.gameIndex}/>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

const Self = connect(
    state => {return {info: state.info}}
)(Inner);

export default Self;