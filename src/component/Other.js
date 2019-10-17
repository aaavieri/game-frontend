import React, { useState, useEffect, useMemo } from "react";
import { Grid, Avatar, Typography } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import {makeStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import PokerCard from "./PokerCard"
import Timer from "./Timer"
import {http} from "../util";
import { useTimer } from "react-timer-hook";

const useStyles = makeStyles(theme => ({
    container: {
        width: "100%",
        height: "100%",
        flexGrow: 1,
        padding: 20
    },
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

function Inner(props) {
    const classes = useStyles();
    const listenerName = `Other.${position}`;
    const { info: {userId, lordUser}, position } = props;
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
        if (lordUser === userId) {
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
        if (lordUser === userId) {
            setAvatarSrc("/asset/img/lord.jpg");
            setPlaying(true);
            cardCount += lordCards.length;
        } else if (lordUser) {
            setAvatarSrc("/asset/img/farmer.jpg");
        }
        setCardLabel(`${cardCount}张牌`);
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

// class ComponentOther extends React.PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {cardLabel: "", otherUser: "未加入", avatarSrc: "/asset/img/unknown.jpg", classes: {}};
//     }
//
//     componentDidMount() {
//         this.setState({classes: useStyles()});
//         // this.timer();
//     }
//
//     // timer = () => {
//     //     const intervalId = setInterval(() => {
//     //         this.setState({ countDown: this.state.countDown - 1}, () => {
//     //             if (this.state.countDown === 0) {
//     //                 clearInterval(intervalId);
//     //             }
//     //         });
//     //     }, 1000);
//     // };
//
//     render() {
//         return (
//             <Grid container wrap="nowrap" spacing={2} className={this.state.classes.container} alignItems={"center"} justify={"center"} direction={"column"}>
//                 <Grid item>
//                     <Typography variant="button" display="block" gutterBottom>{this.state.otherUser}</Typography>
//                 </Grid>
//                 <Grid item>
//                     <Avatar src={this.state.avatarSrc}/>
//                 </Grid>
//                 <Grid item>
//                     <PokerCard cardLabel={this.state.cardLabel}/>
//                 </Grid>
//                 <Grid item>
//                     <div className={this.state.classes.wrapper}>
//                         <Fab aria-label="save"
//                              color="primary"
//                              className={this.state.classes.buttonSuccess}>
//                             {this.state.countDown}
//                         </Fab>
//                         {this.state.countDown > 0 && <CircularProgress size={68} className={this.state.classes.fabProgress} />}
//                     </div>
//                 </Grid>
//             </Grid>
//         );
//     }
// }

export default Other;