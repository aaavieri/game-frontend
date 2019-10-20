import React, { useState, useEffect } from "react";
import { Grid, Avatar, Typography } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import PokerCard from "./PokerCard"
import Timer from "./Timer"
import {http} from "../util";

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
        padding: 20
    },
}));

function Inner(props) {
    const classes = useStyles();
    const { info: {userId, lordUser}, position } = props;
    const listenerName = `Other.${position}`;
    const [ cards, setCards ] = useState([{
        label: "未发牌",
        clickEvent: () => {},
        gameIndex: -1,
        selected: false
    }]);
    const [ playing, setPlaying ] = useState(false);
    const [ avatarSrc, setAvatarSrc ] = useState("/asset/img/unknown.jpg");
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
    http.addDataListener("StartGame", listenerName, ({ lordUser, cardList = [] }) => {
        if (lordUser === userId) {
            setAvatarSrc("/asset/img/lord.jpg");
        } else if (lordUser) {
            setAvatarSrc("/asset/img/farmer.jpg");
        }
        if (cardList.length > 0) {
            setCards(cardList.map(transferCard));
        }
    });
    http.addDataListener("CallLord", listenerName, ({ lordUser, lordCards = [] }) => {
        if (lordUser === userId) {
            setAvatarSrc("/asset/img/lord.jpg");
            setPlaying(true);
            setCards(...cards, ...(lordCards.map(transferCard)));
        } else if (lordUser) {
            setAvatarSrc("/asset/img/farmer.jpg");
        }
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
    return (
        <Grid container wrap="nowrap" spacing={2} className={classes.container} alignItems={"flex-start"} justify={"center"} direction={"row"}>
            <Grid item className={classes.leftArea}>
                <Grid container className={classes.userContainer} wrap="nowrap" spacing={2} alignItems={"center"} justify={"center"} direction={"column"}>
                    <Grid item>
                        <Typography variant="button" display="block" gutterBottom>{userId}</Typography>
                    </Grid>
                    <Grid item>
                        <Avatar src={avatarSrc}/>
                    </Grid>
                    <Grid item>
                        {playing && <Timer countDown={10}/>}
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