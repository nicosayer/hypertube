import React, { Component } from 'react';
import { connect } from 'react-redux'

// import Input from '../../../../components/Input'

import { fetchWrap } from '../../../../services/fetchWrap';

import './style.css';

const language = require('./language.json');

class Comments extends Component {

	constructor(props) {
		super(props);
		this.state = {
			comments: []
		}
		this.myCommentInput = React.createRef();
		this.submitComment = this.submitComment.bind(this);
	}

	componentDidMount() {
		this.getComments();
	}

	submitComment(event) {
		if (event && event.which === 13 && event.target && event.target.value) {
			fetchWrap('/home/video/addComment', {
				method: 'POST',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					comment: event.target.value.substring(0, 2000),
					canal: this.props.canal,
					movieId: this.props.movieId
				})
			})
			.then(data => {
				this.myCommentInput.current.value = '';
				this.getComments();
			})
			.catch(err => console.log(err))
		}
	}

	getComments() {
		fetchWrap('/home/video/getComments', {
			method: 'POST',
			credentials: 'include',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				canal: this.props.canal,
				movieId: this.props.movieId
			})
		})
		.then(comments => this.setState({ comments }))
		.catch(err => console.log(err))
	}

	render() {

		const comments =
		[...this.state.comments].reverse().filter(comment => comment.user && (comment.user.login || (comment.user.firstName && comment.user.lastName)) && comment.date && comment.comment).map((comment, key) =>
		<div key={key} className='commentContainer'>
			<img
				alt='profile'
				className='circle commentPicture'
				src={'http://localhost:3001/pictures/' + comment.userId + '.png'}
				onError={event => event.target.src = 'http://localhost:3001/pictures/default.png'}
				/>
			<div className='commentTextContainer'>
				<div>
					{
						comment.user.login ?
						comment.user.login
						:
						comment.user.firstName + ' ' + comment.user.lastName
					}<span className='fontXSmall spaceLeft fontGrey'>{
						Math.floor(((new Date()) - (new Date(comment.date))) / 1000 / 60 / 60 / 24) > 1
						?
						this.props.me.language === 'en'
						?
						Math.floor(((new Date()) - (new Date(comment.date))) / 1000 / 60 / 60 / 24) + ' days ago'
						:
						'il y a ' + Math.floor(((new Date()) - (new Date(comment.date))) / 1000 / 60 / 60 / 24) + ' jours'
						:
						Math.floor(((new Date()) - (new Date(comment.date))) / 1000 / 60 / 60 / 24)
						?
						language.yesterday[this.props.me.language]
						:
						language.today[this.props.me.language]
					}</span>
				</div>
				<div className='commentText'>{comment.comment}</div>
			</div>
		</div>);

		return(
			<div className='commentSection'>
				<div className='lignBottom'>{ language.title[this.props.me.language] }</div>
				<img
					alt='profile'
					className='circle commentPicture'
					src={'http://localhost:3001/pictures/' + this.props.me._id + '.png'}
					onError={event => event.target.src = 'http://localhost:3001/pictures/default.png'}
					/>
				<input
					ref={this.myCommentInput}
					placeholder={ language.myCommentPlaceholder[this.props.me.language] }
					className='myCommentInput'
					onKeyDown={this.submitComment}
					/>
				<div className='fontXSmall fontRight fontGrey'>{ language.howToSubmit[this.props.me.language] }</div>
				<div className='lignBottom'></div>
				{comments}
			</div>
		);
	}
}

function mapStateToProps(state) {
	const { me } = state.handleMe;
	return ({
		me
	})
}

export default connect(mapStateToProps)(Comments)
