const defaultState = {userId: "", gameId: -1, login: false, lordUser: "", joined: false, gameStatus: "NOT_ENOUGH_USER", userStatus: "WAITING_OTHER_JOIN"};
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_USER_ID":
            return {...state, userId: action.payload.userId};
        case "LOGIN_SUCCESS":
            return {...state, login: true};
        case "JOIN_SUCCESS":
            return {...state, gameId: action.payload.gameId};
        case "QUIT_SUCCESS":
            return {...state, gameId: -1, lordUser: null};
        case "SET_LORD_USER":
            return {...state, lordUser: action.payload.lordUser};
        case "SET_STATUS":
            return {...state, gameStatus: action.payload.gameStatus, userStatus: action.payload.userStatus};
        default:
            return state
    }
};

export default reducer