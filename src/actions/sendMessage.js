import { errorSendMessage, sendingMessage, addMessage } from './messages';
import api from '../api';

export default function sendMessage(roomId, text, payload) {
    return async function (dispatch, getState) {
        dispatch(sendingMessage(true));
        try {
            let message = '';
            if (payload === 'system'){
                message = await api.sendSystemMessage(roomId, text);
            } else {
                message = await api.sendMessage(roomId, text);
            }

            dispatch(addMessage(message));
        } catch (error) {
            dispatch(errorSendMessage(error));
        } finally {
            dispatch(sendingMessage(false));
        }
    };
}
