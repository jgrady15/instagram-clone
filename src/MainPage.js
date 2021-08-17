import React, { useEffect, useState } from 'react';
import Post from './Post.js';
import './MainPage.css';
import { database, auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import ImageUpload from './ImageUpload.js';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

export default function MainPage() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
  
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
  
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          // User has logged in...
          console.log(authUser);
          setUser(authUser);
        }
  
        else {
          // User has logged out...
          setUser(null);
        }
      })
  
      return () => {
        // Perform clean-up action before recursive call
        unsubscribe();
      }
    }, [user, username]);
  
    // useEffect, runs a piece of code based on specific conditions
    useEffect(() => {
      // Code starts here
      database.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        // Everytime a post is added, this code runs
        setPosts(snapshot.docs.map(doc => ({
          id: doc.id,
          post: doc.data()
        })));
      });
    }, []);   // Blank means it loads when the app component is rendered 
  
    const signUp = (event) => {
      event.preventDefault();
      auth.createUserWithEmailAndPassword(email, password).then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      }).catch((error) => alert(error.message));
  
      setOpen(false);
    }
  
    const signIn = (event) => {
      event.preventDefault();
      auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message))
      setOpenSignIn(false);
    }

    return (
      <div className='app'>
        <Modal open={open} onClose={() => setOpen(false)}>
            <div style={modalStyle} className={classes.paper}>
                <form className='app__signup'>
                    <center><h3>Instagram</h3></center>
                    <Input placeholder='E-mail'
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input placeholder='Username'
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                    <Input placeholder='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type='submit' onClick={signUp}>Sign Up</Button>
                </form>
            </div>
        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
            <div style={modalStyle} className={classes.paper}>
                <form className='app__signup'>
                    <center><h3>Instagram</h3></center>
                    <Input placeholder='E-mail'
                    type='text'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input placeholder='Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type='submit' onClick={signIn}>Sign In</Button>
                </form>
            </div>
        </Modal>

        <div className='app__header'>
            <div className='app__userHeader'>
                <button className='logo-header'>
                    <Button id='header'>Instagram</Button>
                </button>
                {
                  user ? (
                    <Button onClick={() => auth.signOut()}>Logout</Button>
                  ) : (
                    <div className='app__loginContainer'>
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                  )
                }
            </div>
        </div>

        <div class="app__posts">
            <div class="app__postsLeft">
            {
                posts.map(({ id, post }) => (
                <Post key={id} postId={id} user={user ? user.displayName : ('')} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
                ))
            }
            </div>
            <div className='app__postsRight'>
            </div>
        </div>

        <footer className='app__footer-imageUpload'>
            {
            user?.displayName ? (
                <ImageUpload username={user.displayName} className='app__footer-progressBar'/>
            ) : (
                <h3>You need to login to post</h3>
            )}
        </footer>
      </div>
    )
}
