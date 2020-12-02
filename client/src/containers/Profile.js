import React, { Component } from 'react';
import Axios from 'axios'

import HeaderBar from '../common/HeaderBar';
import imagebackgroundfood from '../images/backgroundfood.jpg'

import { withStyles, InputAdornment, TextField, Button, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Snackbar } from '@material-ui/core';
import { AccountCircle, Face, Group, FitnessCenter, Equalizer, SportsFootball } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Profile extends Component {


    constructor(props) {
        super(props);
        this.state = {  
            isFirstLoad: false,
            userName: '',
            userNameError: false,
            userAge: '',
            userAgeError: false,
            userHeight: '',
            userHeightError: false,
            userWeight: '',
            userWeightError: false,
            userActivity: '',
            userActivityError: false,
            bmr: '',
            userGender: 'female',
            isUpdated: false,
            snackbarSuccess: false,
            snackbarError: false,
        };
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

    fetchData = () =>{
        const sqlQuery = `SELECT * FROM users WHERE userID=${this.props.userID};`
        
        

        Axios.get("http://localhost:3001/api/select", {
            params:{
                sqlQuery: sqlQuery
            },
        }).then((res) => {
            if(res.data.status == 'error'){
                this.setState({snackbarError: true,})
                console.log(res.data.msg)
            }else if(res.data.status == 'success' && res.data.msg.length == 0){
                this.setState({isFirstLoad: true})
            }else{
                console.log('3:')
                console.log(res.data.msg)
                this.setState({
                    isFirstLoad: false,
                    userName: res.data.msg[0].name,
                    userAge: res.data.msg[0].age,
                    userHeight: res.data.msg[0].height,
                    userWeight: res.data.msg[0].weight,
                    userActivity: String(res.data.msg[0].dailyActivity),
                    bmr: res.data.msg[0].BMR,
                    userGender: res.data.msg[0].gender,
                    snackbarSuccess: true,
                })
                
            }
        })
    }

    componentWillMount = () =>{
        this.fetchData()
    }

    handleCancelCreate = () =>{

        if(this.state.isFirstLoad){            
            var isError = false

            if(!this.state.userName){
                this.setState({userNameError: true})
                isError = true
            }
            if(!this.state.userAge){
                this.setState({userAgeError: true})
                isError = true
            }
            if(!this.state.userHeight){
                this.setState({userHeightError: true})
                isError = true
            }
            if(!this.state.userWeight){
                this.setState({userWeightError: true})
                isError = true
            }
            if(!this.state.userActivity){
                this.setState({userActivityError: true})
                isError = true
            }


            if(!isError){
                // this.setState({isLoading: true})

                const sqlQuery = `INSERT INTO users (userID, name, weight, height, age, BMR, dailyActivity, gender) VALUES (${this.props.userID},'${this.state.userName}',${this.state.userWeight},${this.state.userHeight},${this.state.userAge},${this.state.bmr},${this.state.userActivity},'${this.state.userGender}');`
                // console.log(sqlQuery)
                Axios.post("http://localhost:3001/api/insert", {
                    sqlQuery: sqlQuery
                }).then((res) => {
                    if(res.data.status == 'error'){
                        console.log(res.data.msg)
                        this.setState({snackbarError: true})
                    }else{
                        this.setState({isFirstLoad: false, snackbarSuccess: true})
                    }
                })
            }
        }else{
            this.setState({isUpdated: false})
            this.fetchData()
        }
    }

    handleEdit = () =>{
               
        var isError = false

        if(!this.state.userName){
            this.setState({userNameError: true})
            isError = true
        }
        if(!this.state.userAge){
            this.setState({userAgeError: true})
            isError = true
        }
        if(!this.state.userHeight){
            this.setState({userHeightError: true})
            isError = true
        }
        if(!this.state.userWeight){
            this.setState({userWeightError: true})
            isError = true
        }
        if(!this.state.userActivity){
            this.setState({userActivityError: true})
            isError = true
        }


        if(!isError){

            const sqlQuery = `UPDATE users SET name = '${this.state.userName}', weight = ${this.state.userWeight}, height = ${this.state.userHeight}, age = ${this.state.userAge}, BMR = ${this.state.bmr}, dailyActivity = ${this.state.userActivity}, gender = '${this.state.userGender}' WHERE userID = ${this.props.userID};`
            
            Axios.post("http://localhost:3001/api/update", {
                sqlQuery: sqlQuery
            }).then((res) => {
                if(res.data.status == 'error'){
                    console.log(res.data.msg)
                    this.setState({snackbarError: true})
                }else{
                    this.setState({isUpdated: false, snackbarSuccess: true})
                }
            })
        }
        
    }

    calculateBMR = (userWeight, userHeight, userAge, userActivity, userGender ) => {
        
        if(!userHeight || !userAge || !userWeight || !userActivity)
            return ''

        var bmr
        if(userGender == 'male')
            bmr = 10*userWeight + 6.25*userHeight - 5*userAge +5;
        else
            bmr = 10*userWeight + 6.25*userHeight - 5*userAge -161;

        console.log(userWeight)
        console.log(userHeight)
        console.log(userAge)
        console.log(userActivity)
        console.log(userGender)
        console.log(bmr)
        switch(userActivity){
            case '1':
                bmr = bmr*1.2;
                break;
            case '2':
                bmr = bmr*1.375;
                break;
            case '3':
                bmr = bmr*1.55;
                break;
            case '4':
                bmr = bmr*1.725;
                break;
        }
        console.log(bmr)
        return parseInt(bmr)
    }

    handleHeightChange = (e) => {
        let bmr = this.calculateBMR(this.state.userWeight, e.target.value, this.state.userAge, this.state.userActivity, this.state.userGender)
        this.setState({bmr: bmr, userHeight: e.target.value, isUpdated:true})
    }

    handleWeightChange = (e) => {
        let bmr = this.calculateBMR(e.target.value, this.state.userHeight, this.state.userAge, this.state.userActivity, this.state.userGender)
        this.setState({bmr: bmr, userWeight: e.target.value, isUpdated:true})
    }

    handleActChange = (e) => {
        let bmr = this.calculateBMR(this.state.userWeight, this.state.userHeight, this.state.userAge, e.target.dataset.value, this.state.userGender)
        this.setState({bmr: bmr, userActivity: e.target.dataset.value, isUpdated:true})
    }

    handleAgeChange = (e) => {
        let bmr = this.calculateBMR(this.state.userWeight, this.state.userHeight, e.target.value, this.state.userActivity, this.state.userGender)
        this.setState({bmr: bmr, userAge: e.target.value, isUpdated:true})
    }

    handleGenderChange = (e) => {
        let bmr = this.calculateBMR(this.state.userWeight, this.state.userHeight, this.state.userAge, this.state.userActivity, e.target.value)
        this.setState({bmr: bmr, userGender: e.target.value, isUpdated:true})
    }

    render = () => {
        return (
            <div className={this.props.classes.profileContainer}>
                <HeaderBar isFirstLoad={this.state.isFirstLoad} userID={this.props.userID} userBMR={this.state.bmr} container={0} history={this.props.history}/>
                <table className={this.props.classes.tabla}><tbody>
                    <tr className={this.props.classes.trProfileData}>
                        <th colSpan={2}>
                            <h2 className={this.props.classes.title}>Profile Data</h2>
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}>Name</th>
                        <th className={this.props.classes.rightcolumn}>
                        <TextField
                            fullWidth
                            id="email"
                            error={this.state.userNameError}
                            value={this.state.userName}
                            onChange={e => this.setState({ userName: e.target.value, isUpdated:true })}
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircle />
                                </InputAdornment>
                                ),
                            }}
                            />
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}>Gender</th>
                        <th className={this.props.classes.rightcolumn}>
                        <RadioGroup aria-label="gender" name="gender1" value={this.state.userGender} onChange={this.handleGenderChange}>
                            <FormControlLabel value="female" control={<Radio style={{padding: '4px'}}/>} label="Female" />
                            <FormControlLabel value="male" control={<Radio style={{padding: '4px'}}/>} label="Male" />
                        </RadioGroup>
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}>Age</th>
                        <th className={this.props.classes.rightcolumn}>
                        <TextField
                            fullWidth
                            id="name"
                            error={this.state.userAgeError}
                            value={this.state.userAge}
                            margin="normal"
                            onChange={this.handleAgeChange}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Face />
                                </InputAdornment>
                                ),
                            }}
                            />
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}>Height (cm)</th>
                        <th className={this.props.classes.rightcolumn}>
                        <TextField
                            fullWidth
                            id="lastname"
                            error={this.state.userHeightError}
                            value={this.state.userHeight}
                            margin="normal"
                            onChange={this.handleHeightChange}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Group />
                                </InputAdornment>
                                ),
                            }}
                            />
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}>Weight (Kg)</th>
                        <th className={this.props.classes.rightcolumn}>
                        <TextField
                            fullWidth
                            id="Address"
                            value={this.state.userWeight}
                            error={this.state.userWeightError}
                            margin="normal"
                            onChange={this.handleWeightChange}
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <FitnessCenter />
                                </InputAdornment>
                                ),
                            }}
                            />
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}>Daily Activity</th>
                        <th className={this.props.classes.rightcolumn}>
                            <Select
                                className={this.props.classes.selectActivity}
                                error={this.state.userActivityError}
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.userActivity}
                                // onChange={this.handleActChange}
                                startAdornment={<InputAdornment position="start"><SportsFootball/></InputAdornment>}
                            >
                                <MenuItem onClick={this.handleActChange} value={1}>Sedentary</MenuItem>
                                <MenuItem onClick={this.handleActChange} value={2}>Light Exercise</MenuItem>
                                <MenuItem onClick={this.handleActChange} value={3}>Moderate Exercise</MenuItem>
                                <MenuItem onClick={this.handleActChange} value={4}>Intense Exercise</MenuItem>
                            </Select>
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}>BMR (KCal)</th>
                        <th className={this.props.classes.rightcolumn}>
                        <TextField
                            fullWidth
                            id="Address"
                            value={this.state.bmr}
                            margin="normal"
                            disabled
                            InputProps={{
                                startAdornment: (
                                <InputAdornment position="start">
                                    <Equalizer />
                                </InputAdornment>
                                ),
                            }}
                            />
                        </th>
                    </tr>
                    <tr className={this.props.classes.tr}>
                        <th className={this.props.classes.leftcolumn}></th>
                        <th className={this.props.classes.rightcolumn}>
                            {!this.state.isFirstLoad && <Button style={{backgroundColor: '#ebddbc'}} onClick={this.handleEdit} className={this.props.classes.submitButton} variant="contained" color="primary">Edit</Button>}
                            <Button disabled={!this.state.isFirstLoad && !this.state.isUpdated} onClick={this.handleCancelCreate} style={!this.state.isFirstLoad && !this.state.isUpdated ? {backgroundColor: 'rgb(201 201 201)'} : {backgroundColor: '#b03508'}} className={this.props.classes.cancelButton} variant="contained" color="secondary">{this.state.isFirstLoad ? 'Create' : 'Cancel'}</Button>
                        </th>
                    </tr>
                </tbody></table>
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
    profileContainer:{
        backgroundImage: `url(${imagebackgroundfood})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    tabla: {
        width: '760px',
        backgroundColor: 'rgb(255,255,255,0.96)',
        borderRadius: '5px',
        boxShadow: '0px 0px 6px black',
        margin: 'auto',
        marginTop: '45px',
    },
    leftcolumn:{
        textAlign: 'center',
        width: 200
    },
    rightcolumn:{
        width: '70%',
    },
    tr:{
        width: '100%',
        float: 'left',
        height: 70,
    },
    trProfileData:{
        width: '100%',
        float: 'left',
        height: 80,
        backgroundColor: '#ebddbc',
        borderRadius: '5px 5px 0px 0px', 
        marginBottom: '10px'
    },
    title:{
        marginLeft: 50,
        color: '#b03508',
    },
    cancelButton: {
        float: 'right',
        width: '90px',
        color: '#ebddbc',
        backgroundColor: '#b03508',
        fontWeight: '600'
    },
    submitButton: {
        float: 'right',
        width: '90px',
        marginLeft: 7,
        color: '#b03508',
        backgroundColor: '#ebddbc',
        fontWeight: '600'
    },
    selectActivity:{
        textAlign: 'left',
        marginTop: '16px',
        marginBottom: '8px',
    }
    
  });

export default withStyles(styles)(Profile);