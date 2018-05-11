import React from 'react';
import { ChatQuote } from '../ChatQuote/ChatQuote';
import { Avatar } from '../Avatar/Avatar';
import './ChatField.css';

export function ChatField(props) {
    const message = props.message,
        authorId = props.message.userId,
        name = props.name,
        userId = props.userId;
    let direction = 'ChatField_right',
        avatar = '';

    if (!authorId) {
        direction = 'ChatField_center';
    } else if (authorId !== userId) {
        direction = 'ChatField_left';
        /*
         *Здесь загружаем иконку аватара по userId
         // avatar = <Avatar image = {{src:userId.getImageSrc(),modifier:'avatar-s'}}>;
         */
        /* аватарка по умолчанию */
        const image = {
            src: 'https://pp.userapi.com/c637426/v637426871/36cff/tmfGLL9d7ps.jpg',
            modifier: 'avatar-s',
        };
        avatar = <Avatar image={image} />;
    }
    return (
      <div className={direction}>
          {avatar}
          <ChatQuote message={message} userId={userId} name={name}/>
        </div>
    );
}
