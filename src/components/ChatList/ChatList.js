import * as React from 'react';
import { InstanceSummaryElement } from '../InstanceSummaryElement/InstanceSummaryElement';
import './ChatList.css';
import { InfiniteRooms } from '../InfiniteRooms/InfiniteRooms';
import { connect } from 'react-redux';
import { routeNavigation } from '../../actions/route';
import api from '../../api';
import { createDateStamp } from '../../helpers/createDateStamp';

const stateToProps = state => ({
    payload: state.route.payload,
    curUserInfo: state.user.curUserInfo,
});

export const ChatList = connect(stateToProps)(class ChatList extends React.Component {
    async enterRoom(roomId) {
        const users = await api.getUsersOfRoom(roomId),
            usersName = {};
        users.items.forEach(user => {
            usersName[user._id]=user.name;
        });
        this.props.dispatch(routeNavigation({
            page: 'chat_page',
            payload: {
                /*...this.props.payload,*/
                usersName: usersName,
                currentRoom: roomId,
                prevPage: 'chat_list',
            },
        }));
    }
    render() {
        const { rooms, fetchNext, next } = this.props;

        return (
            <InfiniteRooms fetchNext={fetchNext} next={next}>
                {rooms.map((room) => {
                    let roomName = room.name,
                        date = new Date(),
                        author='',
                        description='',
                        timestamp='';
                    if (room && room.lastMessage) {
                        date.setTime(room.lastMessage.created_at);
                        author = room.lastMessage.userName;
                        description = room.lastMessage.message;
                        timestamp = createDateStamp(date);
                    }
                    if (roomName.split(' ').includes(this.props.curUserInfo.name)) {
                        roomName = roomName.replace(this.props.curUserInfo.name, '');
                    }

                    return (<InstanceSummaryElement
                        key={room._id}
                        summary={{
                            avatar: {
                                src: 'https://avatars.mds.yandex.net/get-pdb/1008348/cab77028-8042-4d20-b343-a1498455e4c8/s1200',
                                modifier: 'avatar-s',
                            },
                            title: `${roomName}`,
                            timestamp: `${timestamp}`,
                            author: `${author}`,
                            description: `${description}`,
                            id: `${room._id}`,
                        }}
                        onclick={this.enterRoom.bind(this)}
                    />);
                })}
            </InfiniteRooms>
        );
    }
});

