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
                // const lastVisitResponse = await api.getLastVisit(item._id);
                // if (lastVisitResponse) {
                //     item.lastVisit = lastVisitResponse.last_visit;
                // } else {
                //     item.lastVisit = 0;
                // }
                const messages = await api.getLastRoomMessages(item._id);
                let lastMessage = {};
                let unreadMessages = 0;
                if(messages.items.length>0){
                    lastMessage = messages.items[0];
                    if (lastMessage.userId) {
                        lastMessage.userName = (await api.getUser(lastMessage.userId)).name;
                    } else {
                        lastMessage.userName = "";
                    }

                    item.lastMessage = lastMessage;
                   //
                   // if (lastMessage.created_at > item.lastVisit) {
                   //     unreadMessages++;
                   // }
                }
                else {
                    lastMessage.message = 'нет сообщений';
                    lastMessage.created_at = 0;
                }
                //item.unreadMessages = unreadMessages;
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
