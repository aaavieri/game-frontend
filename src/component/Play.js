import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import PokerCard from "./PokerCard"
import {http, helper} from "../util";

const useStyles = makeStyles({
    container: {
        width: "100%",
        height: "100%",
        flexGrow: 1,
        padding: 20
    },
    cardArea: {
        width: "100%",
        height: 200,
        padding: 0
    },
    explainArea: {
        display: "flex",
        direction: "row-reverse"
    }
});

function Inner(props) {
    const classes = useStyles();
    const { info: {lordUser} } = props;
    const [ cards, setCards ] = useState([]);
    const [ player, setPlayer ] = useState("");
    const [ playerRole, setPlayerRole ] = useState("");
    const [ typeName, setTypeName ] = useState("");
    const [ playing, setPlaying ] = useState(false);
    http.addDataListener("SkipPlay", "Play", ({userId: playUser}) => {
        if (!playing) {
            setPlaying(true);
        }
        setPlayer(playUser);
        setPlayerRole(playUser === lordUser ? "地主" : "农民");
        setTypeName("pass");
        setCards([]);
    });
    http.addDataListener("DoPlay", "Play", ({sentCard: {userId: playUser, type, sentCards}}) => {
        if (!playing) {
            setPlaying(true);
        }
        setPlayer(playUser);
        setPlayerRole(playUser === lordUser ? "地主" : "农民");
        setTypeName(helper.getTypeName(type));
        setCards(sentCards);
    });
    return (
        <Grid container wrap="nowrap" spacing={2} className={classes.container} alignItems={"center"} justify={"center"} direction={"column"}>
            <Grid item>
                <Grid container wrap="nowrap" className={classes.cardArea}>
                    {cards.forEach(card => {
                        return <PokerCard cardLabel={card.cardPojo.label}/>
                    })}
                </Grid>
            </Grid>
            <Grid item>
                <Grid container wrap="nowrap" className={classes.explainArea}>
                    <Typography variant="h5" gutterBottom>
                        {playing && `${player}  ${playerRole}`}
                        {!playing && "尚未开始"}
                    </Typography>
                    <Typography variant="h5" gutterBottom color={"error"}>
                        {typeName}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

const Other = connect(
    state => {return {info: state.info}}
)(Inner);

export default Other;