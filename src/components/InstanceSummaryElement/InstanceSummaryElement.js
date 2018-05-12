import React, { Component } from 'react';
import { Avatar } from '../Avatar/Avatar';
import './InstanceSummaryElement.css';

export class InstanceSummaryElement extends Component {

    handleClick = () => {
        this.props.onclick(this.props.summary.id);
    }

    render() {
        if (!this.props) {
            return null;
        }

        const { summary } = this.props;
        const {
            title, description, author, descModifiers,timestamp
        } = summary;

        let titleClasses = 'InstanceSummaryElement__title';
        let descClasses = 'InstanceSummaryElement__desc';

        if (descModifiers && descModifiers === 'light') {
            titleClasses += ' InstanceSummaryElement__title_light';
            descClasses += ' InstanceSummaryElement__desc_light';
        } else {
            descClasses += ' InstanceSummaryElement__desc_dark';
        }

        let destrTitle = title.split(' ');
        let avaTitle = '';
        if (destrTitle.length === 1){
            avaTitle = title.substring(0, 2);
        } else if (destrTitle.length > 1){
            avaTitle = `${destrTitle[0].substring(0, 1)}${destrTitle[1].substring(0, 1)}`;
        }

        let avatar = avaTitle ? <div className="InstanceSummaryElement__avatar_acronim_wrapper"><span className="InstanceSummaryElement__avatar_acronim">{avaTitle}</span></div> : <Avatar image={this.props.avatar} />

        let descView = '';
        if (author) {
            descView = (<p className={descClasses}>
                <span className="InstanceSummaryElement__author">{`${author}: `}</span>
                {description}
            </p>);
        } else {
            descView = (<p className={descClasses}>
                {description}
            </p>);
        }

        let timestampView='';
        if(timestamp){
            timestampView = <p className="InstanceSummaryElement__info_timestamp">{timestamp}</p>;
        }

        // let unreadMsgCountView ='';
        // if(unreadMsgCount && unreadMsgCount !== '0'){
        //     unreadMsgCountView = <div className="InstanceSummaryElement__info_unreadMsgCount_wrapper"><p className="InstanceSummaryElement__info_unreadMsgCount">{unreadMsgCount}</p></div>;
        // }

        return (
            <div className="InstanceSummaryElement" onClick={this.handleClick}>
                <div className="InstanceSummaryElement__avatar">
                    {avatar}
                </div>
                <div className="InstanceSummaryElement__info">
                    <div className="InstanceSummaryElement__info_header">
                        <h3 className={titleClasses}>{title}</h3>
                        {timestampView}
                    </div>
                    <div className="InstanceSummaryElement__desc_wrap">
                        {descView}
                    </div>
                </div>
            </div>
        );
    }
}

