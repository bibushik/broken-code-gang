import api from '../api';
import { routeNavigation } from './route';

export default function renameRoom(data) {
    return async function (dispatch) {
        try {
            // Loading
            if (!data){
                return null;
            }
            const room = await api.renameRoom(data.roomId, data.userId, data.newName);

            dispatch(routeNavigation({
                page: "chat_settings",
                payload: {
                    roomName: room.name
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

