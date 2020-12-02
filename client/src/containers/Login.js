import React, { Component } from 'react';
import Axios from 'axios'

import { delay } from '../common/auxFunctions';

import imagebackgroundfood from '../images/backgroundfood.jpg'
import { withStyles, InputAdornment, TextField, Button, CircularProgress, Snackbar } from '@material-ui/core';
import { AccountCircle, Lock } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';



function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {  
            emailSignIn: '',
            passwordSignIn: '',
            emailSignUp: '',
            passwordSignUp: '',
            signInerror: false,
            signUperror: false,
            isSignUp: false,
            isLoading: false,
            snackbarSuccess: false,
            snackbarError: false,
        };
    }

    handleEmail = (event) => {
        if(this.state.isSignUp)
            this.setState({emailSignUp: event.target.value})
        else
            this.setState({emailSignIn: event.target.value})
    }

    handlePassword = (event) => {
        if(this.state.isSignUp)
            this.setState({passwordSignUp: event.target.value})
        else
            this.setState({passwordSignIn: event.target.value})
    }

    handleSignIn = async () => {
        if(this.state.isSignUp){
            this.setState({isSignUp: false})
        }            
        else{
            if(this.state.emailSignIn && this.state.passwordSignIn){
                this.setState({isLoading: true})
                
                const sqlQuery = `SELECT id FROM accounts WHERE username='${this.state.emailSignIn}' AND password='${this.state.passwordSignIn}';`

                Axios.get("http://localhost:3001/api/select", {
                    params:{
                        sqlQuery: sqlQuery
                    },
                }).then((res) => {
                    if(res.data.status == 'error'){
                        console.log(res.data.msg)
                        this.setState({isLoading: false, signInerror: true, snackbarError: true})
                    }else if(res.data.status == 'success' && res.data.msg.length == 0){
                        this.setState({isLoading: false, signInerror: true, snackbarError: true})
                    }else{
                        this.setState({isLoading: false, signInerror: false})
                        this.props.history.push(`/profile/${res.data.msg[0].id}`);
                    }
                })
            }
            else
                this.setState({signInerror: true})
        }
    }

    handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') 
            return;
    
        this.setState({snackbarSuccess: false})
    };

    handleCloseError = (event, reason) => {
        if (reason === 'clickaway') 
            return;
        
        this.setState({snackbarError: false})
    };

    handleSignUp = async () => {
        if(this.state.isSignUp){
            if(this.state.emailSignUp && this.state.passwordSignUp){
                this.setState({isLoading: true})

                const sqlQuery = `INSERT INTO accounts (username, password) VALUES ('${this.state.emailSignUp}','${this.state.passwordSignUp}');`
                Axios.post("http://localhost:3001/api/insert", {
                    sqlQuery: sqlQuery
                }).then((res) => {
                    if(res.data.status == 'error'){
                        console.log(res.data.msg)
                        this.setState({isLoading: false, isSignUp: true, signUperror: true, snackbarError: true})
                    }else{
                        this.setState({isLoading: false, isSignUp: false, signUperror: false, emailSignUp: '',passwordSignUp: '', snackbarSuccess: true})
                    }
                }) 
            }
            else
                this.setState({signUperror: true})
        }            
        else
            this.setState({isSignUp: true})
            
    }

    

    render() {
        return(
            <div className={this.props.classes.backgroundLogin}>
                <div className={this.props.classes.loginCard}> 
                {this.state.isLoading && <CircularProgress className={this.props.classes.spinner}/>}
                    <div className={this.state.isLoading ? this.props.classes.isHidden : this.props.classes.emptyClass}>
                        <TextField
                            className={this.props.classes.emailField}              
                            id="username-input"
                            placeholder="Username"
                            value={this.state.isSignUp ? this.state.emailSignUp : this.state.emailSignIn}
                            onChange={this.handleEmail}
                            fullWidth
                            error={this.state.isSignUp ? this.state.signUperror : this.state.signInerror}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                                ),
                            }}
                        />
                        <TextField      
                            className={this.props.classes.pwdField}
                            id="password-input"
                            placeholder="Password"
                            type="password"
                            value={this.state.isSignUp ? this.state.passwordSignUp : this.state.passwordSignIn}
                            onChange={this.handlePassword}
                            fullWidth
                            error={this.state.isSignUp ? this.state.signUperror : this.state.signInerror}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Lock />
                                </InputAdornment>
                                ),
                            }}
                        />
                        <div className={this.props.classes.buttonContainer}>
                            <Button style={{backgroundColor: '#b03508'}} className={this.props.classes.signinButton} variant="contained" color="primary" onClick={this.handleSignIn}>
                                {this.state.isSignUp ? "CANCEL" : "SIGN IN"}
                            </Button>
                            <Button style={{backgroundColor: '#ebddbc'}} className={this.props.classes.signupButton} variant="contained" color="secondary" onClick={this.handleSignUp}>
                                {this.state.isSignUp ? "CREATE" : "SIGN UP"}
                            </Button>
                        </div>
                    </div>
                </div>
                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={this.state.snackbarSuccess} autoHideDuration={3000} onClose={this.handleCloseSuccess}>
                    <Alert onClose={this.handleCloseSuccess} severity="success">
                        Success!
                    </Alert>
                </Snackbar>
                <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={this.state.snackbarError} autoHideDuration={3000} onClose={this.handleCloseError}>
                    <Alert onClose={this.handleCloseError} severity="error">
                        Error!
                    </Alert>
                </Snackbar>
                
            </div>
        );
    }
}



const styles = theme => ({
    backgroundLogin:{
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        textAlign: 'center',
        backgroundImage: `url(${imagebackgroundfood})`,
        // backgroundColor: #a8d5e7
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
    },
    loginCard:{
        borderRadius: '5px',
        backgroundColor: 'rgb(255,255,255,0.96)',
        boxShadow: '0px 0px 6px black',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: 'auto', 
        padding: '20px',
        paddingTop: 30

    },
    emailField:{

    },
    pwdField:{
        marginTop: 20
    },
    buttonContainer:{
        marginTop: 30,
        marginBottom: 10
    },
    signinButton:{
        width: 120,
        marginRight: '20px',
        color: '#ebddbc',
        backgroundColor: '#b03508',
        fontWeight: '600'
    },
    signupButton:{
        width: 120,
        margin: 'auto',
        color: '#b03508',
        backgroundColor: '#ebddbc',
        fontWeight: '600'
    },
    isHidden:{
        pointerEvents: 'none',
        opacity: '0',
        // transition: 'opacity 500ms 500ms', 
    },
    spinner:{
        position: 'absolute',


        width: '100px !important',
        height: '100px !important',
        top: 50,
        left: 125
    },
    emptyClass:{}
});

export default withStyles(styles)(Login);