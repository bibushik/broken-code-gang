import { compareMessages } from '../helpers/compareMessages';

export default function rooms(state, action) {
    if (!state) {
        return {
            items: [],
            next: true,
            error: null,
        };
    }
    switch (action.type) {
        case 'ROOM_ADD':
            return {
                ...state,
                items: [...state.items, action.room],
                newRoom: action.room,
            };
        case 'ROOMS_FETCH':
            return {
                ...state,
                items: [...state.items, ...action.items],
                next: action.next,
                end: action.end,
            };
        case 'USER_SIGN_OUT':
            return {
                items: [],
                next: true,
            };
        case 'ROOMS_RESET':
            return {
                ...state,
                items: [],
                next: null,
            };
        case 'ROOMS_UPDATE_LAST_MESSAGE':
            let newItems = [...state.items],
                newState = {
                    ...state,
                };
            newItems.forEach((item) => {
                if (item._id === (action && action.newMessage.roomId)) {
                    if (action.newRoomName){
                        item.name = action.newRoomName;
                    }
                    item.lastMessage = action.newMessage;
                    newState.items =  newItems;
                }
            });
            newState.items.sort(compareMessages);
            return newState;
        case 'ROOMS_DISPLAY_NEW_ROOM':
            return {
                ...state,
                items: [action.room, ...state.items],
            };
        case 'ROOMS_ERROR':
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}
