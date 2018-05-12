import React, { Component } from 'react';
import { ConnectedHeader } from '../Header/Header';
import { ConnectedFooter } from '../Footer/Footer';
import { ChatField } from '../ChatField/ChatField';
import { connect } from 'react-redux';
import './ChatPage.css';
import fetchMessages from '../../actions/fetchMessages';
import { InfiniteScroll } from '../InfiniteScroll/InfiniteScroll';
import api from '../../api';
import MemberCount from '../../helpers/MemberCount';
import {routeNavigation} from  '../../actions/route';

const stateToProps = state => ({
    messages: state.messages,
    payload: state.route.payload,
    userId:state.user._id,
    curUserInfo:state.user.curUserInfo
});


export class ChatPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.fetchNext = this.props.dispatch.bind(this, fetchMessages(this.props.payload.currentRoom));
        this.lastMessage = null;
        this.props.dispatch({
            type:'MESSAGES_RELOAD',
        });
        this.dispatch=this.props.dispatch.bind(this);
        this.openChatSettings = this.openChatSettings.bind(this);
    }

    componentWillMount = async () => {
        this.getChatInfo(this.props.payload.currentRoom);
        await api.currentUserEnterRoom(this.props.payload.currentRoom);
    };

    getChatInfo = async (chatId) => {
        let chatInfo = await api.getRoom(chatId);
        this.setState({
            chatInfo: chatInfo
        });
    };

    async openChatSettings() {
        const room = await api.getRoom(this.props.payload.currentRoom);
        const users = await api.getUsersOfRoom(room._id);

        this.dispatch(routeNavigation({
            page: 'chat_settings',
            payload: {
                ...this.props.payload,
                prevPrevPage:'chat_list',
                prevPage: 'chat_page',
                chatUsers:users.items,
                roomName: room.name
            }
        }));
    }

    componentDidUpdate() {
        if (this.props.messages.items[this.props.messages.items.length - 1] !== this.lastMessage) {
            this.lastMessage = this.props.messages.items[this.props.messages.items.length - 1];
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        }
    }
    
    componentWillUnmount = async () => {
        await api.currentUserEnterRoom(this.props.payload.currentRoom);
    };

    render() {

        const messages = this.props.messages.items,
            next = this.props.messages.next,
            userId = this.props.userId,
            usersName = this.props.payload.usersName;

        let chatPageContent = '';
        if (messages && messages.length) {
            chatPageContent = messages.map(message => (
                <div key={message._id}>
                    <ChatField message={message} userId={userId} name={usersName[message.userId]}/>
                </div>));
        } else {
            chatPageContent = <div className="ChatPage__empty"><p>No messages here yet...</p></div>;
        }

        let contentTitle = '';
        let contentDesc = '';
        let chatInfo = this.state.chatInfo;
        if (chatInfo) {
            contentTitle = chatInfo.name;
            if (contentTitle.split(' ').includes(this.props.curUserInfo.name)) {
                contentTitle = contentTitle.replace(this.props.curUserInfo.name, '');
            }
            if (chatInfo.users.length === 1){
                contentDesc = '';
            } else {
                contentDesc = `${chatInfo.users.length} ${MemberCount(chatInfo.users.length)}`
            }
        }

        return (
            <div className="ChatPage">
                <div className="ChatPage__Header">
                    <ConnectedHeader contentTitle={contentTitle} openChatSettings={this.openChatSettings} contentDesc={contentDesc} buttonBack buttonSearch={false} buttonSettings={true} contentType="chat" />
                </div>

                <InfiniteScroll fetchNext={this.fetchNext} scrollDirection="up" next={next}>
                    <div className="ChatPage__MessageField">
                        {chatPageContent}
                    </div>
                </InfiniteScroll>
                <div className="ChatPage__Footer">
                    <ConnectedFooter submitIcon="send" />
                </div>
            </div>
        );
    }
}

export const ConnectedChatPage = connect(stateToProps)(ChatPage);
