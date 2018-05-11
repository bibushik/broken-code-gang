import React, { Component } from 'react';
import { UserList } from '../UserList/UserList';
import { LinkBtn } from '../Buttons/LinkBtn/LinkBtn';
import './GroupChatSettings.css';
import { ConnectedHeader } from '../Header/Header';
import { connect } from 'react-redux';
import leaveRoom from '../../actions/leaveRoom';
import renameRoom from '../../actions/renameRoom';
import { routeNavigation } from '../../actions/route';

const stateToProps = state => ({
    payload: state.route.payload,
    users: state.users.items,
    next: state.users.next,
});

export default class GroupChatSettings extends Component {
    removeUserFromChat = () => {
        this.props.dispatch(leaveRoom(this.props.payload.currentRoom));
    };

    renameChat = (newName) => {
        const roomId = this.props.payload.currentRoom;
        const data = {
            roomId: roomId,
            userId: null,
            newName: newName
        };
        this.props.dispatch(renameRoom(data));
    };

    addNewUserToChat = () => {
        this.props.dispatch(routeNavigation({
            page: 'add_new_user_to_chat_page',
            payload: {
                prevPage: 'chat_settings',
                prevPrevPage: this.props.payload.prevPage,
                prevPrevPrevPage:this.props.payload.prevPrevPage,
            }
        }));
    };


    render () {
        const membersQuan = this.props.payload.chatUsers.length,
            groupName = this.props.payload.roomName;

        return (
            <div className="GroupChatSettings">
                <section className="GroupChatSettings__section">
                    <div className="">
                        <ConnectedHeader contentTitle={groupName} contentDesc="" buttonBack buttonSearch={false}
                                         buttonSettings={false} contentType="chat" buttonEdit rename submitInput={this.renameChat}
                        />
                    </div>
                </section>
                <section className="GroupChatSettings__section">
                    <h4 className="GroupChatSettings__section__title">Members ({membersQuan})</h4>
                    <LinkBtn className="GroupChatSettings__exit" btnText="Добавить участника"
                             onclick={this.addNewUserToChat}/>
                    <UserList
                        users={this.props.payload.chatUsers}
                    />
                </section>
                <section className="GroupChatSettings__section">
                    <LinkBtn className="GroupChatSettings__exit" btnText="Exit" onclick={this.removeUserFromChat}/>
                </section>
            </div>
        );
    }
}

export const ConnectedGroupChatSettings = connect(stateToProps)(GroupChatSettings);