const defaultState = {userId: "", gameId: -1, login: false, lordUser: ""};
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_USER_ID":
            return {...state, userId: action.payload.userId};
        case "SET_GAME_ID":
            return {...state, gameId: action.payload.gameId};
        case "LOGIN_SUCCESS":
            return {...state, login: true};
        case "SET_LORD_USER":
            return {...state, lordUser: action.payload.lordUser};
        default:
            return state
    }
};

export default reducer