import React, { Component } from 'react';

import HeaderBar from '../common/HeaderBar';
import RowHeader from '../components/RowHeader';
import MealPlanRow from '../components/MealPlanRow';
import Axios from 'axios'


import imagebackgroundfood from '../images/backgroundfood.jpg'

import { withStyles, InputAdornment, TextField, FormControl, Button, Select, MenuItem, Divider, Chip, InputLabel, IconButton, Dialog, DialogTitle, Checkbox, Snackbar } from '@material-ui/core';
import { Delete, AddCircleOutline, Fastfood} from '@material-ui/icons';

import ChipInput from 'material-ui-chip-input'
import MuiAlert from '@material-ui/lab/Alert';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const recipeSample = {
    userID: 0,
    recipeID: 0, 
    name: 'No Meal Plan Selected',
    calories: 0,
    fat: 0,
    carbs: 0,
    protein: 0,
    isGlutenFree: 0,
    isVegetarian: 0,
    difficulty: 0 ,

    instructions: 'N/A',
    ingredients: 'N/A'
}

const sampleDay = [recipeSample,recipeSample,recipeSample,recipeSample]

const sampleMealPlan = [sampleDay,sampleDay,sampleDay,sampleDay,sampleDay,sampleDay,sampleDay]


class MealPlanner extends Component {


    constructor(props) {
        super(props);
        this.state = {  
            mealPlanSelected: 0,
            mealPlans: ['Meal Plan 1','Meal Plan 2','Meal Plan 3'],
            dialogPreparation: false,
            prepRecipeName: '',
            prepRecipeIngredients: '',
            prepRecipePrep: '',
            mealPlan: [],
            mealPlan2d: [],
            nmeals: 0,
            init: 0,

            dialogAdd: false,
            addMealPlanName: 1,
            addMealPlanVeg: false,
            addMealPlanGF: false,
            addMealPlanEasy: false,
            addMealPlanGoal: 0,
            addMealPlannMeals: 4,
            snackbarSuccess: false,
            snackbarError: false
        };
    }

    
    displayMealPlan = (mealPlan) => {
        
        var res = mealPlan.map( (component,index) => {
            var backColor
            switch(index) {
                case 2:
                    backColor = '#ffb350'
                    break;
                case 3:
                    backColor = '#64af57'
                    break;
                case 4:
                    backColor = '#61b2f8'
                    break;
                case 0:
                    backColor = '#65bfcf'
                    break;
                case 1:
                    backColor = '#ff824f'
                    break;
                case 5:
                    backColor = '#dad373'
                    break;
                case 6:
                    backColor = '#ff5e5e'
                    break;
                default:
                    backColor = '#ffb350'
              }
            return (
                <MealPlanRow nDay={index+1} weekMeals={component} backColor={backColor} key={index} showRecipe={this.showRecipe}/>
            )
        })

        return res
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


    showRecipe = (recipeID, nMeal, nDay) => {
        console.log(recipeID)
        console.log(nDay)
        console.log(nMeal)

        // const recipeToShow = this.state.mysqldata.filter(e => e.recipeID == recipeID)[0];

        const recipeToShow = this.state.mealPlan2d[nDay][nMeal];
            

        this.setState({
            dialogPreparation: true,
            prepRecipeName: recipeToShow.name,
            prepRecipeIngredients: recipeToShow.ingredients.split(','),
            prepRecipePrep: recipeToShow.instructions

        })
    }


    handleAddMealPlan = () => {
        console.log(this.state.addMealPlanName)
        console.log(this.state.addMealPlanVeg)
        console.log(this.state.addMealPlanGF)
        console.log(this.state.addMealPlanEasy)
        console.log(this.state.addMealPlanGoal)
        console.log(this.state.addMealPlannMeals)
        console.log(this.props.userBMR)
        console.log(this.props.userID)

       const sqlQuery = `INSERT INTO meal_plans (mealNumber, userID, isVegetarian, isGlutenFree, isEasyCook, goal, nMeals, name, kcalGoal) VALUES (${this.state.addMealPlanName}, ${this.props.userID}, ${this.state.addMealPlanVeg}, ${this.state.addMealPlanGF},  ${this.state.addMealPlanEasy}, ${this.state.addMealPlanGoal}, ${this.state.addMealPlannMeals}, 'Meal Plan', ${this.props.userBMR});`

        
        Axios.post("http://localhost:3001/api/insert", {
            sqlQuery: sqlQuery
        }).then((res) => {
            if(res.data.status == 'error'){
                console.log(res.data.msg)
                this.setState({snackbarError: true})
            }else{
                this.handlePlanRecipes();
                this.setState({dialogAdd: false});
            }
        })

       
    }

    deleteMP = () =>{
        const sqlQuery = `DELETE FROM meal_plans WHERE userID = ${this.props.userID} && mealNumber = ${this.state.mealPlanSelected};`

        
        Axios.post("http://localhost:3001/api/delete", {
            sqlQuery: sqlQuery
        }).then((res) => {
            if(res.data.status == 'error'){
                console.log(res.data.msg)
                this.setState({snackbarError: true})
            }else{
                this.setState({snackbarSuccess: true});
            }
        })

    }

    deleteMPR = () =>{
        const sqlQuery = `DELETE FROM plan_recipes WHERE userID = ${this.props.userID} && mealNumber = ${this.state.mealPlanSelected};`

        
        Axios.post("http://localhost:3001/api/delete", {
            sqlQuery: sqlQuery
        }).then((res) => {
            if(res.data.status == 'error'){
                console.log(res.data.msg)
            }else{

            }
        })

    }

    fetchData = () =>{
        const sqlQuery = `SELECT * FROM (meal_plans LEFT OUTER JOIN plan_recipes ON meal_plans.mealNumber = plan_recipes.mealNumber) LEFT OUTER JOIN recipes ON plan_recipes.recipeID = recipes.recipeID WHERE plan_recipes.userID = ${this.props.userID} && plan_recipes.mealNumber = ${this.state.mealPlanSelected} ORDER BY day, time ASC;`

        Axios.get("http://localhost:3001/api/select", {
            params:{
                sqlQuery: sqlQuery
            },
        }).then((res) => {
            if(res.data.status == 'error'){
                this.setState({snackbarError: true,})
                console.log(res.data.status)
                this.setState({mealPlan2d: sampleMealPlan})
            }else if(res.data.status == 'success' && res.data.msg.length == 0){
                if(this.state.init == 0)
                {
                    this.setState({init: 1,}) 
                    this.setState({mealPlan2d: sampleMealPlan})
                }
                else{
                    this.setState({snackbarError: true,})
                    this.setState({mealPlan2d: sampleMealPlan})
                }
                console.log(res.data.msg)
                
            }else{
                console.log('3:')
                console.log(res.data.msg)
                if(res.data.msg[0].nMeals == 4)
                {
                this.setState({
                    nmeals: 4,
                    mealPlan: res.data.msg
                })
                const nmp = [];
                while(this.state.mealPlan.length) nmp.push(this.state.mealPlan.splice(0,this.state.nmeals));
                this.setState({mealPlan2d: nmp})
                }
                else
                {
                this.setState({
                    nmeals: 3,
                    mealPlan: res.data.msg
                })    
                const nmp = [];
                while(this.state.mealPlan.length) nmp.push(this.state.mealPlan.splice(0,this.state.nmeals));
                this.setState({mealPlan2d: nmp})
                }
            }
        })
    }

    componentWillMount = () =>{
        this.fetchData()
    }

    handlePlanRecipes = () => {
        console.log(this.state.addMealPlanName)
        console.log(this.state.addMealPlanVeg)
        console.log(this.state.addMealPlanGF)
        console.log(this.state.addMealPlanEasy)
        console.log(this.state.addMealPlanGoal)
        console.log(this.state.addMealPlannMeals)
        console.log(this.props.userBMR)
        console.log(this.props.userID)

        let nmeals = this.state.addMealPlannMeals;
        let vg = this.state.addMealPlanVeg;
        let gf = this.state.addMealPlanGF;
        var ez;
        if(this.state.addMealPlanEasy)
        ez = 3;
        else
        ez = 5;
        let gl = this.state.addMealPlanGoal;

            for(let i = 0; i < 7; i++)
            {
                for(let x = 0; x < nmeals; x++)
                {
                    const sqlQuery = `INSERT INTO plan_recipes (userID, mealNumber, recipeID, time, day) VALUES (${this.props.userID}, ${this.state.addMealPlanName}, (SELECT recipeID FROM testing_schema.recipes
                        WHERE recipes.calories < ${this.props.userBMR}/${nmeals} && recipes.protein > ${gl}*2 && recipes.carbs < ${gl}+10 && recipes.fat < ${gl}+15 && recipes.difficulty <= ${ez} && recipes.isVegetarian = ${vg} && recipes.isGlutenFree = ${gf}
                        ORDER BY RAND()
                        LIMIT 1), ${x}, ${i});`

                    Axios.post("http://localhost:3001/api/insert", {
                        sqlQuery: sqlQuery
                    }).then((res) => {
                        if(res.data.status == 'error'){
                            console.log(res.data.msg)
                            this.setState({snackbarError: true})
                        }else{                      
                            this.setState({snackbarSuccess: true})
                        }
                    })
                }
            }

            this.fetchData();
        }

    
    

    renderMealPlanOptions = (mealPlans) => {
        var res = mealPlans.map( (component,index) => {
            return (<MenuItem key={index} value={index+1}>{component}</MenuItem>)
        })
        return res
    }

    handleSelectedMealPlan = (e) => {
        
        this.setState({mealPlanSelected: e.target.value}, () =>{
            this.fetchData() 
        })
        
    }

    handleDeleteMealPlan = () => {
        this.setState({mealPlan2d: sampleMealPlan}, () =>{
            this.deleteMP() 
            this.deleteMPR()
        })
    }


    render() {
        return(
            <div className={this.props.classes.container}>
                <HeaderBar isFirstLoad={false} userID={this.props.userID} userBMR={this.props.userBMR} container={1} history={this.props.history}/>
                <div className={this.props.classes.card}>
                    <div className={this.props.classes.cardHeader}>Select your Meal Plan:</div>
                    <div>
                        <Select
                            className={this.props.classes.selectActivity}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.mealPlanSelected}
                            onChange={e => this.handleSelectedMealPlan(e)}
                            startAdornment={<InputAdornment position="start"><Fastfood/></InputAdornment>}
                        >
                            {this.renderMealPlanOptions(this.state.mealPlans)}                            
                        </Select>

                        
                        <IconButton className={this.props.classes.createButton} aria-label="create" onClick={() => this.setState({dialogAdd: true})}>
                            <AddCircleOutline fontSize="inherit" />
                        </IconButton>
                        <IconButton className={this.props.classes.deleteButton} aria-label="delete" onClick={() => this.handleDeleteMealPlan()}>
                            <Delete fontSize="inherit" />
                        </IconButton>
                        
                    </div>
                    {/* <Divider className={this.props.classes.divider}/>
                    <div className={this.props.classes.tagsHeader}>Tags:</div>
                    <Chip label="Vegetarian" className={this.props.classes.chip}/>
                    <Chip color="secondary" label="Easy to Cook" className={this.props.classes.chip}/>
                    <Chip color="secondary" label="Gluten Free" className={this.props.classes.chip}/>
                    <Divider className={this.props.classes.divider2}/> */}

                    {/* <div className={this.props.classes.goal}>Goal: <strong style={{color: '#b03508'}}> Gain muscle </strong> </div> */}
                    <div className={this.props.classes.goal}> <strong style={{color: '#b03508'}}> </strong> </div>
                    <div className={this.props.classes.kcalgoal}>Daily Kcalories: <strong style={{color: '#b03508'}}>{this.props.userBMR}</strong> </div>
                </div>
                <div className={this.props.classes.mealPlan}>
                    <RowHeader meals={this.state.nmeals}/>
                    {this.displayMealPlan(this.state.mealPlan2d)}
                </div>

                <Dialog  aria-labelledby="simple-dialog-title" open={this.state.dialogPreparation} onClose={() => {this.setState({dialogPreparation: false})}}>
                    <DialogTitle className={this.props.classes.dialogPreparationTitle} id="simple-dialog-title">{this.state.prepRecipeName}</DialogTitle>
                    <Divider/>
                    <div className={this.props.classes.dialogPreparationIngredientsDiv}>
                        <div className={this.props.classes.dialogPreparationIngredientsTitle}>Ingredients:</div>
                        <div>
                            <ChipInput
                                className={this.props.classes.chipDiv}
                                value={this.state.prepRecipeIngredients}
                                readOnly
                                disabled
                                disableUnderline
                            />
                        </div>
                    </div>
                    <Divider/>
                    <div className={this.props.classes.dialogPreparationIngredientsDiv}>
                        <div className={this.props.classes.dialogPreparationIngredientsTitle}>Preparation:</div>
                        <div className={this.props.classes.dialogPreparationData}>
                            {this.state.prepRecipePrep}
                        </div>
                    </div>
                </Dialog>

                <Dialog  aria-labelledby="simple-dialog-title" open={this.state.dialogAdd} onClose={() => {this.setState({dialogAdd: false})}}>
                    <DialogTitle className={this.props.classes.dialogPreparationTitle} id="simple-dialog-title">Add Meal Plan</DialogTitle>
                    <Divider/>
                    <FormControl className={this.props.classes.selectGoal}>
                    <InputLabel id="demo-simple-select-label-2">Plan Number</InputLabel>
                    <Select
                        fullWidth
                        labelId="demo-simple-select-label-4"
                        id="demo-simple-select-4"
                        value={this.state.addMealPlanName}
                    >
                        <MenuItem onClick={() => this.setState({addMealPlanName: 1})} value={1}>1</MenuItem>
                        <MenuItem onClick={() => this.setState({addMealPlanName: 2})} value={2}>2</MenuItem>
                        <MenuItem onClick={() => this.setState({addMealPlanName: 3})} value={3}>3</MenuItem>
                    </Select>
                    </FormControl>
                    {/* <TextField
                        className={this.props.classes.addMealPlanName}
                        id="addMealPlanName"
                        label="Name"
                        value={this.state.addMealPlanName}
                        onChange={e => this.setState({ addMealPlanName: e.target.value })}
                        margin="normal"
                       
                    />
                     */}
                    <div className={this.props.classes.dispFlex}>
                        <div className={this.props.classes.checkboxContainer}>
                            <div className={this.props.classes.checkboxWrapperAdd}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.addMealPlanVeg} onChange={e => this.setState({ addMealPlanVeg: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Vegetarian</label>
                            </div>
                            <div className={this.props.classes.checkboxWrapperAdd}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.addMealPlanGF} onChange={e => this.setState({ addMealPlanGF: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Gluten Free</label>
                            </div>
                            <div className={this.props.classes.checkboxWrapperAdd}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.addMealPlanEasy} onChange={e => this.setState({ addMealPlanEasy: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Easy to Cook</label>
                            </div>
                            
                        </div>
                    </div>
                    <FormControl className={this.props.classes.selectGoal}>
                    <InputLabel id="demo-simple-select-label-2">Goal</InputLabel>
                    <Select
                        fullWidth
                        labelId="demo-simple-select-label-2"
                        id="demo-simple-select-2"
                        value={this.state.addMealPlanGoal}
                    >
                        <MenuItem onClick={() => this.setState({addMealPlanGoal: 10})} value={10}>Lose weight</MenuItem>
                        <MenuItem onClick={() => this.setState({addMealPlanGoal: 25})} value={25}>Gain Muscle</MenuItem>
                        <MenuItem onClick={() => this.setState({addMealPlanGoal: 17})} value={17}>Maintain</MenuItem>
                    </Select>
                    </FormControl>
                    
                    <FormControl className={this.props.classes.selectGoal}>
                    <InputLabel id="demo-simple-select-label-3">Meals per day</InputLabel>
                    <Select
                        fullWidth
                        labelId="demo-simple-select-label-3"
                        id="demo-simple-select-3"
                        value={this.state.addMealPlannMeals}
                    >
                        <MenuItem onClick={() => this.setState({addMealPlannMeals: 3})} value={3}>3</MenuItem>
                        <MenuItem onClick={() => this.setState({addMealPlannMeals: 4})} value={4}>4</MenuItem>
                    </Select>
                    </FormControl>
                    
                    <div style={{margin: '24px'}}>
                        <Button onClick={this.handleAddMealPlan} style={{backgroundColor: '#ebddbc'}} className={this.props.classes.addButton} variant="contained" color="primary">Add</Button>
                        <Button onClick={() => {this.setState({dialogAdd: false})}} className={this.props.classes.cancelButton} variant="contained" color="secondary">Cancel</Button>
                    </div>
                </Dialog>
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
    container:{
        backgroundImage: `url(${imagebackgroundfood})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat-y',
        paddingBottom: '40px'
    },
    selectActivity:{
        textAlign: 'left',
        width: '300px' 
    },
    selectGoal:{
        textAlign: 'left',
        width: '200px',
        marginLeft: '24px',
        marginTop: '26px'
    },
    dispFlex:{
        display: 'flex'
    },
    card:{
        width: '40%',
        margin: 'auto',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '1px 1px 4px grey',
        padding: '30px',
        marginTop: '30px'
    },
    deleteButton: {
        float: 'right',
    },
    createButton: {
        float: 'right',
    },
    cardHeader:{
        fontWeight: '600',
        marginBottom: '25px',
        fontSize: '20px',
    },
    tagsHeader:{
        fontWeight: '400',
        marginBottom: '25px',
        fontSize: '18px',
    },
    divider:{
        marginBottom: '20px',
        marginTop: '30px',
    },
    divider2:{
        marginBottom: '20px',
        marginTop: '20px',
    },
    chip:{
        marginBottom: '10px',
        marginRight: '15px',
        fontWeight: '700',
        fontSize: '14px',
        boxShadow: '1px 1px 4px grey',
        backgroundColor: '#ebddbc',
        '& span' :{
            color: '#b03406'
        }
    },
    mealPlan:{
        backgroundColor: 'rgb(255,255,255,0.96)',
        borderRadius: '5px',
        boxShadow: '0px 0px 6px black',
        marginTop: '30px',
        marginBottom: '30px',
        marginLeft: '20px',
        marginRight: '20px',
    },
    kcalgoal:{
        fontSize: '18px'
    },
    goal:{
        marginBottom: '15px',
        fontSize: '18px'
    },
    dialogPreparationTitle:{
        width: '552px',
        backgroundColor: '#ebddbc',
        color: '#b03508',
        '& h2':{
            fontWeight: '600',
        }
        
    },
    dialogPreparationIngredientsDiv:{
        width: '550px',
        paddingLeft: '24px',
        paddingRight: '24px',
        paddingTop: '16px',
        paddingBottom: '16px',
    },
    dialogPreparationIngredientsTitle:{
        marginBottom: '10px',
        fontWeight: '600'
    },
    chipDiv:{
        marginTop: '5px',
        '& input' :{
            display: 'none'
        },
        '& svg' :{
            display: 'none'
        }
    },
    addMealPlanName:{
        marginLeft: '24px',
        width: '350px',
    },
    checkboxContainer:{
        display: 'flex',
        marginTop: '29px'
    },
    checkboxWrapperAdd:{
        marginRight: '10px',
        marginLeft: '17px'
    },
    checkbox:{
        padding: '5px',
    },
    checkboxLabel:{
        verticalAlign: 'middle'
    },
    addButton: {
        float: 'right',
        width: '90px',
        marginLeft: 7,
        color: '#b03508',
        backgroundColor: '#ebddbc',
        fontWeight: '600'
    },
    cancelButton: {
        float: 'right',
        width: '90px',
        color: '#ebddbc',
        backgroundColor: '#b03508',
        fontWeight: '600'
    },
});

export default withStyles(styles)(MealPlanner);