import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Header.css';
import { HeaderCenterItems } from '../HeaderCenterItems/HeaderCenterItems';
import { Button } from '../Button/Button';
import { routeNavigation } from '../../actions/route';

const stateToProps = state => ({
    payload: state.route.payload,
    page: state.route.page,
});

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.userInput = React.createRef();
        this.state = {
            input: false,
        };
    }
    goBack() {
        const payload = this.props.payload;
        if (!payload || !payload.prevPage || payload.prevPage === 'authorization') {
            return null;
        }
        const prevPage = this.props.payload.prevPage;
        this.props.dispatch(routeNavigation({
            page: prevPage,
            payload: {
                ...this.props.payload,
                prevPage: this.props.payload.prevPrevPage ? this.props.payload.prevPrevPage : '',
                prevPrevPage: this.props.payload.prevPrevPrevPage ? this.props.payload.prevPrevPrevPage : '',
            },
        }));
    }

    componentWillReceiveProps() {
        if (this.state.input){
            this.cancelInput();
        }
    }

    startInput() {
        this.setState({
            input: true,
        });
    }

    openChatSettings(){
        this.props.openChatSettings();
    }

    handleInput(event) {
        this.props.handleInput(event);
    }

    submitInput (){
        this.props.submitInput(this.userInput.current.value);
    };

    resetInput(event) {
        this.props.resetInput(event);
    }

    cancelInput() {
        this.setState({
            input: false,
        });
    }

    render() {
        const {
            buttonBack,
            buttonSearch,
            buttonSettings,
            contentType,
            buttonEdit
        } = this.props;
        const btnFillerStyle = { width: '30px', height: '30px' };
        const btnFiller = <div style={btnFillerStyle}>&nbsp;</div>;
        const leftControl = buttonBack ? <Button type="back" active modifier="s" circle onClick={this.goBack.bind(this)} >''</Button> : btnFiller;
        let rightControl = btnFiller;
        if (buttonSearch) {
            rightControl = <Button type="search" active modifier="s" circle onClick={this.startInput.bind(this)} />;
        } else if (buttonSettings) {
            rightControl = <Button type="settings" active modifier="s" circle onClick={this.openChatSettings.bind(this)}/>;
        } else if (buttonEdit) {
            rightControl = <Button type="edit" active modifier="s" circle onClick={this.startInput.bind(this)}/>;
        }
        let contentTitle = '';
        let contentDesc = '';
        switch (contentType) {
        case 'chats':
            contentTitle = 'BCG';
            break;
        case 'add-room':
            contentTitle = 'Создать kомнату';
            break;
        case 'contacts':
            contentTitle = 'Contacts';
            break;
        case 'add-user':
            contentTitle = 'Select contact';
            break;
        case 'settings':
            contentTitle = 'Settings';
            break;
        case 'chat':
            contentTitle = this.props.contentTitle || 'Chat';
            contentDesc = this.props.contentDesc || '';
            break;
        default:
            contentTitle = 'BCG';
            break;
        }

        let headerContent = '';
        if (this.state.input || this.props.searchIsOn) {
            let rightControl = '';
            let centerInput = '';
            if (this.props.rename){
                centerInput = <input ref={this.userInput} autoFocus type="text" className="Header__type_input" placeholder='Введите название чата' />
                rightControl = <Button type="ok" active modifier="s" circle onClick={this.submitInput.bind(this)} />;
            } else {
                centerInput = <input autoFocus type="text" className="Header__type_input" onChange={this.handleInput.bind(this)} value={this.props.searchIsOn} />
                rightControl = <Button type="delete" active modifier="s" circle onClick={this.resetInput.bind(this)} />;
            }
            headerContent = (<div className="Header__type_wrapper">
                <Button type="back" active modifier="s" circle onClick={this.cancelInput.bind(this)} />
                {centerInput}
                {rightControl}
                             </div>);
        } else {
            headerContent = <HeaderCenterItems title={contentTitle} desc={contentDesc} />;
        }


        return (
            <header className="Header">
                {leftControl}
                {headerContent}
                {rightControl}
            </header>
        );
    }
}

export const ConnectedHeader = connect(stateToProps)(Header);
