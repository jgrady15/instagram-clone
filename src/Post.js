import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Button, Input } from '@material-ui/core';
import firebase from 'firebase';
import { database } from './firebase';
import ReactDOMServer from 'react-dom/server';

import './Post.css';

function Post({ postId, user, username, caption, imageUrl }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    const [liked, setLiked] = useState(false);
    const [viewCommentStatus, setViewCommentStatus] = useState(false);
    const [sharePostStatus, setSharePostStatus] = useState(false);
    const [collectionStatus, setCollectionStatus] = useState(false);

    const incrementFavorites = (event) => {
        event.preventDefault();
        database.collection('posts').doc(postId).update({
            likes: firebase.firestore.FieldValue.increment(1),
        });

        /* // This is for a save state, so that we can remember to save the liked post
        database.collection('users').doc(userId).update({
            likedPosts: JSON.stringify(database.collection('post').doc(postId))
        }) 
        */

        setLiked(true);
    }

    function decrementFavorites() {
        database.collection('posts').doc(postId).update({
            likes: firebase.firestore.FieldValue.increment(-1)   
        });

        return false;
    }

    const likePost = (event) => {
        event.preventDefault();
        database.collection('users')
    }
    
    const postComment = (event) => {
        event.preventDefault();
        database.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setComment('');
    }

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = database.collection('posts').doc(postId).collection('comments').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    return (
        <div className='post'>
            <div className='post__header'>
                <a href='/'>
                    <Avatar 
                        className='post__avatar' 
                        alt={username} 
                        src='/static/images/avatar/1.jpg'
                    />
                </a>
                <h3>{username}</h3>
            </div>
            
            <img className='post__image' src={imageUrl} alt='' />
            <div className='post__toolbar'>
                <div className='post__toolbar-three'>
                    <Button onClick={(e) => incrementFavorites}>
                        {
                            liked ? (
                                // on
                                <svg id='favorites' xmlns="http://www.w3.org/2000/svg" height="29" viewBox="0 -3 24 24" width="29"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>    
                            ) : (
                                // off
                                <svg id='favorites' xmlns="http://www.w3.org/2000/svg" height="29" viewBox="0 -3 24 24" width="29"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
                            )
                        }
                    </Button>
                    <Button onClick={() => setViewCommentStatus(!viewCommentStatus)}>
                        {
                            viewCommentStatus ? (
                                // on
                                <svg id='viewComments-link' xmlns="http://www.w3.org/2000/svg" height="27" viewBox="0 -3 24 24" width="27"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                            ) : (
                                // off
                                <svg id='viewComments-link' xmlns="http://www.w3.org/2000/svg" height="27" viewBox="0 -3 24 24" width="27"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
                            )
                        }
                    </Button>
                    <Button onClick={() => setSharePostStatus(!sharePostStatus)}>
                        {
                            sharePostStatus ? (
                                // on
                                // Dummy code, add an alert or a popup menu with stuff related to user following to share posts with
                                <svg id='favorites' xmlns="http://www.w3.org/2000/svg" height="29" viewBox="0 -3 24 24" width="29"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                            ) : (
                                // off
                                <svg id='share' xmlns="http://www.w3.org/2000/svg" height="27" viewBox="0 1 24 24" width="27"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/></svg>
                            )
                        }
                    </Button>
                </div>
                <div className='collections-separate'>
                    <Button id='collections-button' onClick={() => setCollectionStatus(!collectionStatus)}>
                        {
                            collectionStatus ? (
                                // on
                                <svg id='collections' xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -2 24 24" width="28"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
                                ) : (
                                // off
                                <svg id='collections' xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -2 24 24" width="28"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
                            )
                        }
                    </Button>
                </div>
            </div>
            <h4 className='post__text'><strong>{username}</strong>: {caption}</h4>
            <div className='post__comments'>
                {
                    comments.map(comment => (
                        <p>
                            <strong>{JSON.stringify(comment.username).replace(/\"/g, "")}:</strong> {JSON.stringify(comment.text).replace(/\"/g, "")}
                        </p>
                    ))
                }
            </div>
            <div className='post__timestamp'>
                <p>{}</p>
            </div>
            {
                user && (
                <form className='post__commentBox'>
                    <input 
                        className='post__input'
                        type='text'
                        placeholder='Add a comment...'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)} 
                    /> 
                    <button 
                        className='post__button' 
                        disabled={!comment} 
                        type='submit' 
                        onClick={postComment}
                    >
                        Post
                    </button>
                </form>
            )}
        </div>
    )
}

export default Post;
