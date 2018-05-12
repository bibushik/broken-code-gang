import api from '../api';
import { routeNavigation } from './route';

export default function leaveRoom(roomId) {
    return async function (dispatch) {
        try {
            // Loading
            const room = await api.currentUserLeaveRoom(roomId);
            if (room.users.length > 0 && room.users.length < 2) {
                await api.dropRoom(roomId);
            }

            dispatch(routeNavigation({
                page: 'chat_list',
                payload: {
                    footerNav: {
                        active: 'chat'
                    }
                }
            }));
        } catch (error) {
            dispatch({
                type: 'ROOMS_ERROR',
                error,
            });
        }
    };
}

