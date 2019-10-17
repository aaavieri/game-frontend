const defaultState = {timer: 0};
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case "TIMER_INIT":
            return {...state, timer: 10};
        case "TIMER_MINUS":
            return {...state, timer: state.timer - 1};
        default:
            return state
    }
};

export default reducer