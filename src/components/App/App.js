import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import { AuthorizationPage } from '../AuthorizationPage/AuthorizationPage';
import { ChatListPage } from '../ChatListPage/ChatListPage';
import { AddRoomPage } from '../AddRoomPage/AddRoomPage';
import { ConnectedChatPage } from '../ChatPage/ChatPage';
import { ConnectedUserPage } from '../UserPage/UserPage';
import { ConnectedContactsListPage } from '../ContactsListPage/ContactsListPage';
import { ConnectedGroupChatSettings } from '../GroupChatSettings/GroupChatSettings';
import { ConnectedUserList } from '../UserList/UserList';
import { ConnectedAddUserToChatPage } from '../AddUserToChatPage/AddUserToChatPage';
import {routeNavigation} from '../../actions/route';
import { addMessage } from '../../actions/messages';
import { updateLastMessage, displayNewRoom } from '../../actions/rooms';
import createBrowserNotification from '../../helpers/createBrowserNotification';
import api from '../../api';

// TODO: create page for the settings

const routeConfig = {
    authorization: {
        view: AuthorizationPage,
    },
    'chat_list': {
        view: ChatListPage
    },
    'contacts_list': {
        view: ConnectedContactsListPage
    },
    add_room_page: {
        view: AddRoomPage,
    },
    chat_page: {
        view: ConnectedChatPage,
    },
    'user_list':{
        view: ConnectedUserList,
    },
    'settings': {
        view: ConnectedUserPage,
    },
    'chat_settings': {
        view: ConnectedGroupChatSettings,
    },
    'add_new_user_to_chat_page':{
        view: ConnectedAddUserToChatPage,
    }
};

const stateToProps = state => ({
    route: state.route,
    rooms: state.rooms
});

class App extends Component {

    constructor(props) {
        super(props);
        this.loadApp = this.loadApp.bind(this);
    }

    componentWillMount(){
        console.log(this.props);
        this.loadApp()
        .catch ((e)=>{
            console.log(e);
        })
            
        
            .then((user) => {
                console.log(user);
               if (user){

                   const app = this;

                   api.onPendingConnection((roomId)=>{
                       api.currentUserJoinChannel(roomId);
                   });

                   api.onMessage((message) => {
                       console.log('onMessage');
                       let isMessageFromNewRoom = app.props.rooms.items.filter((room) => {
                           return message.roomId === room._id;
                       });

                       if (!isMessageFromNewRoom.length && app.props.route.page === 'chat_list'){
                           app.props.dispatch(displayNewRoom(message.roomId));
                       } else {
                           app.props.dispatch(updateLastMessage(message));
                       }

                       if(app.props.route.page === 'chat_page' && app.props.route.payload.currentRoom === message.roomId){
                           app.props.dispatch(addMessage(message));
                       }

                       if (message.userId) {

                           if ((Notification.permission === "granted")) {
                               const { roomId, userId, message: messageText } = message;

                               Promise.all([ api.getUser(userId), api.getRoom(roomId)]).then((result) => {
                                   const [{ name: userName }, { name: roomName }] = result;

                                   createBrowserNotification(
                                       roomName,
                                       `${userName}: ${messageText}`,
                                   );
                               });
                           }
                       }

                   });

                   api.onUserLeavedRoom(async (result) => {
                       console.log('onUserLeavedRoom');
                   });

                   api.onUserJoinedRoom(async (result) => {
                       console.log('onUserJoinedRoom');
                   });

                this.props.dispatch(routeNavigation({
                    page: 'chat_list',
                    payload: {
                        footerNav: {
                            active: 'chat'
                        }
                    }
                }));
               }
               else {
                this.props.dispatch(routeNavigation({
                    page: 'authorization',
                    payload: {
                    }
                }));
               }
            });
    }

    loadApp(){
        return api.getCurrentUser();
    }



    render() {
        const Page = routeConfig[this.props.route.page] && routeConfig[this.props.route.page].view;

        if (!Page) {
            return  (
                <div className="spinner">
                    <div className="rect1" />
                    <div className="rect2" />
                    <div className="rect3" />
                    <div className="rect4" />
                    <div className="rect5" />
                </div>
            );
        }
        return (
            <Page />
        );
    }
}

export default connect(stateToProps)(App);
