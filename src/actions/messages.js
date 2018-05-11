export const addMessage = (message) => {
        return ({
            type: 'MESSAGE_ADD',
            message,
        })
};

export const removeMessage = () => ({
    type: 'MESSAGE_REMOVE',
});

export const readMessage = () => ({
    type: 'MESSAGE_READ',
});

export const errorSendMessage = error => ({
    type: 'MESSAGE_SEND_ERROR',
    error,
});

export const sendingMessage = sending => ({
    type: 'MESSAGE_SENDING',
    sending,
});