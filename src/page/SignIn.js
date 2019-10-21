import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Games, AccountCircle, Lock} from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import {http} from '../util';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    margin: {
        margin: theme.spacing(1),
    }
}));

function Inner(props) {
    const classes = useStyles();
    const {userId, setUserId, loginSuccess, history} = props;
    const [username, setUsername] = useState(userId);
    const [password, setPassword] = useState('');

    const onLogin = async () => {
        const {success} = await http.login({userId: username, password});
        if (success) {
            setUserId(username);
            loginSuccess();
            document.title = `${username} - game`;
            // http.startGameEvent(username);
            history.push('/');
        }
    };
    const enter = async e => {
        switch (e.keyCode) {
            case 13:
                await onLogin();
                break
        }
    };

    return (
        <Container component="main" maxWidth="xs" onKeyDown={enter}>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <Games />
                </Avatar>
                <Typography component="h1" variant="h5">
                    进入游戏
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="用户名"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                            ),
                        }}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="密码"
                        type="password"
                        id="password"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                            ),
                        }}
                        autoComplete="current-password"
                    />
                    <Button
                        type="button"
                        fullWidth
                        onClick={onLogin}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        登录
                    </Button>
                </form>
            </div>
        </Container>
    );
}

const SignIn = withRouter(connect(
    state => {return {userId: state.info.userId}},
    {
        setUserId: userId => ({type: 'SET_USER_ID', payload: {userId}}),
        loginSuccess: () => ({type: 'LOGIN_SUCCESS'})
    }
)(Inner));

export default SignIn