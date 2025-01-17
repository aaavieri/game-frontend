import React, {useEffect} from 'react';
import {CssBaseline, GridList, GridListTile} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles';
import {withRouter} from 'react-router';
import {connect} from "react-redux";
import Other from '../component/Other'
import Play from '../component/Play'
import Self from '../component/Self'
import {http} from '../util';
import { Redirect } from "react-router";

const useStyles = makeStyles(theme => ({
    game: {
        backgroundColor: '#cfe8fc',
        height: '100vh',
        width: '100vw'
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap',
        marginBottom: theme.spacing(1),
    },
    gridList: {
        width: '100%',
        height: '100%',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    otherArea: {
        height: '70%!important'
    },
    selfArea: {
        height: '30%!important'
    },
    playArea: {
        height: '70%!important'
    }
}));

function Inner(props) {
    const classes = useStyles();
    const {joinSuccess, setLordUser, quitSuccess, setStatus, info: {joined, userId, gameId}} = props;
    http.addDataListener("*", "Game", console.log);
    http.addDataListener("*", "Game", ({gameStatus, userStatus}) => {
        setStatus(gameStatus, userStatus);
    });
    http.addDataListener("CallLord", "Game", ({lordUser}) => {
        setLordUser(lordUser);
    });
    http.addDataListener("QuitGame", "Game", () => {
        quitSuccess();
    });
    useEffect(() => {
        if (userId) {
            let tempGameId = gameId;
            http.startGameEvent(userId, () => {
                if (!joined) {
                    http.joinGame({userId}).then(({success, data: gameId, claims: {eventData}}) => {
                        if (success) {
                            tempGameId = gameId;
                            joinSuccess(gameId);
                            http.triggerGameEvent(eventData, "JoinGame", "ALL");
                        }
                    })
                }
            });
            return () => {
                http.quitGame({userId, gameId:　tempGameId}).then(http.stopGameEvent);
            };
        }
    }, []);
    if (!userId) {
        return <Redirect to="/"/>;
    }
    return <React.Fragment>
        <CssBaseline/>
        <div className={classes.game}>
            <GridList className={classes.gridList} cols={10}>
                <GridListTile cols={2} className={classes.otherArea}>
                    <Other position={-1}/>
                </GridListTile>
                <GridListTile cols={6} className={classes.playArea}>
                    <Play/>
                </GridListTile>
                <GridListTile cols={2} className={classes.otherArea}>
                    <Other position={1}/>
                </GridListTile>
                <GridListTile cols={10} className={classes.selfArea}>
                    <Self/>
                </GridListTile>
            </GridList>
        </div>
    </React.Fragment>
}

const Game = withRouter(connect(
    state => {return {info: state.info}},
    {
        setLordUser: lordUser => ({type: "SET_LORD_USER", payload: {lordUser}}),
        joinSuccess: gameId => ({type: "JOIN_SUCCESS", payload: {gameId}}),
        quitSuccess: () => ({type: "QUIT_SUCCESS"}),
        setStatus: (gameStatus, userStatus) => ({type: "SET_STATUS", payload: {gameStatus, userStatus}})
    }
)(Inner));

export default Game