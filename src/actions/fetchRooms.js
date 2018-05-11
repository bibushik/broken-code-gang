import api from '../api';
import { compareMessages } from '../helpers/compareMessages';

export default function fetchRooms() {
    return async function (dispatch, getState) {
        try {
            const room = await api.getCurrentUserRooms(getState().rooms.next);
            const { items, next } = room;
            const end = !!(next);
            for(let item of items){
                await  api.currentUserJoinChannel(item._id);
                const messages = await api.getLastRoomMessages(item._id);
                let lastMessage = {};
                if(messages.items.length>0){
                    lastMessage = messages.items[0];
                    if (lastMessage.userId) {
                        lastMessage.userName = (await api.getUser(lastMessage.userId)).name;
                    } else {
                        lastMessage.userName = "";
                    }

                    item.lastMessage = lastMessage;
                }
                else {
                    lastMessage.message = 'нет сообщений';
                    lastMessage.created_at = 0;
                }
            }

            items.sort(compareMessages);
            dispatch({
                type: 'ROOMS_FETCH',
                items,
                next,
                end,
            });
        } catch (error) {
            dispatch({
                type: 'ROOMS_ERROR',
                error,
            });
        }
    };
}
