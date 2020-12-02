import React, { Component } from 'react';
import Axios from 'axios'
import _ from 'lodash'

import HeaderBar from '../common/HeaderBar';
import RecipesHeader from '../components/RecipesHeader';
import RecipesRow from '../components/RecipesRow';
import imagebackgroundfood from '../images/backgroundfood.jpg'

import { withStyles, InputAdornment, TextField, Button, Slider, Snackbar, Checkbox, Divider, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';
import { Search, AddCircleOutline, Edit, Delete } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';

import ChipInput from 'material-ui-chip-input'


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const marks = [
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
  ];


class Recipes extends Component {

    constructor(props) {
        super(props);
        this.state = {  
            titleSearch: '',
            sliderKcal: [0,1000],
            sliderFat: [0,100],
            sliderCarbs: [0,100],
            sliderProtein: [0,100],
            difficulty: [1,5],
            isGlutenFree: false,
            isVegetarian: false,

            mysqldata: [],
            checkedRecipes: {},
            isLoading: false,
            snackbarSuccess: false,
            snackbarError: false,

            dialogPreparation: false,
            dialogAdd: false,
            dialogEdit: false,

            addRecipeName: '',
            addRecipeKcal: '',
            addRecipeFat: '',
            addRecipeCarbs: '',
            addRecipeProtein: '',
            addRecipeDiff: '',
            addRecipeIngredients: [],
            addRecipePrep: '',
            addRecipeGF: false,
            addRecipeVeg: false,
            addRecipeError: false,

            editRecipeID: '',
            editRecipeName: '',
            editRecipeKcal: '',
            editRecipeFat: '',
            editRecipeCarbs: '',
            editRecipeProtein: '',
            editRecipeDiff: '',
            editRecipeIngredients: [],
            editRecipePrep: '',
            editRecipeGF: false,
            editRecipeVeg: false,
            editRecipeError: false,

            prepRecipeName: '',
            prepRecipeIngredients: [],
            prepRecipePrep: '',
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






    showRecipe = (recipeID) => {
        
        const recipeToShow = this.state.mysqldata.filter(e => e.recipeID == recipeID)[0];
        this.setState({
            dialogPreparation: true,
            prepRecipeName: recipeToShow.name,
            prepRecipeIngredients: recipeToShow.ingredients.split(','),
            prepRecipePrep: recipeToShow.instructions

        })
    }

    valueText = (value) =>{
        return `${value}`
    }




    handleSliderKcal = (e,n) => {
        this.setState({ sliderKcal: n})
    }

    handleSliderFat = (e,n) => {
        this.setState({ sliderFat: n})
    }

    handleSliderCarbs = (e,n) => {
        this.setState({ sliderCarbs: n})
    }

    handleSliderProtein = (e,n) => {
        this.setState({ sliderProtein: n})
    }

    handleSliderDifficulty = (e,n) => {
        this.setState({ difficulty: n})
        
    }

    handleSearch = () =>{
        console.log(this.state.titleSearch)
        console.log(this.state.sliderKcal)
        console.log(this.state.sliderFat)
        console.log(this.state.sliderCarbs)
        console.log(this.state.sliderProtein)
        console.log(this.state.difficulty)
        console.log(this.state.isGlutenFree)
        console.log(this.state.isVegetarian)
        console.log(this.props.userID)

        var sqlQuery = `SELECT * FROM recipes WHERE (name LIKE '%${this.state.titleSearch}%') AND (calories BETWEEN ${this.state.sliderKcal[0]} AND ${this.state.sliderKcal[1]}) AND (fat BETWEEN ${this.state.sliderFat[0]} AND ${this.state.sliderFat[1]}) AND (carbs BETWEEN ${this.state.sliderCarbs[0]} AND ${this.state.sliderCarbs[1]}) AND (protein BETWEEN ${this.state.sliderProtein[0]} AND ${this.state.sliderProtein[1]}) AND (difficulty BETWEEN ${this.state.difficulty[0]} AND ${this.state.difficulty[1]}) AND (owner='main' OR owner='${this.props.userID}')`

        if(this.state.isGlutenFree)
            sqlQuery = sqlQuery + ' AND (isGlutenFree=1)'
        if(this.state.isVegetarian)
            sqlQuery = sqlQuery + ' AND (isVegetarian=1)'

        sqlQuery = sqlQuery + ';'
        this.setState({isLoading: true, checkedRecipes: {}})
        // console.log(sqlQuery)
        Axios.get("http://localhost:3001/api/select", {
                    params:{
                        sqlQuery: sqlQuery
                    },
                }).then((res) => {
                    if(res.data.status == 'error'){
                        console.log(res.data.msg)
                        this.setState({snackbarError: true, isLoading: false})
                    }else if(res.data.status == 'success' && res.data.msg.length == 0){
                        console.log('empty')
                        this.setState({mysqldata: [], snackbarSuccess: true, isLoading: false})
                    }else{
                        this.setState({mysqldata: res.data.msg.splice(0,50), snackbarSuccess: true, isLoading: false})
                        // console.log(res.data.msg.splice(0,300))
                        // this.setState({isFirstLoad: false, snackbarSuccess: true})
                    }
                })
    }

    handleChipAdd = (chips) => {
        console.log(chips)
        this.setState({addRecipeIngredients: chips})
    }

    handleChipDeleteAdd = (chip) => {
        
        var tmp = {...this.state.addRecipeIngredients}
        var nextAddRecipeIngredients = []
        Object.keys(tmp).forEach((e,i) => {
            if(chip != tmp[e]){
                nextAddRecipeIngredients.push(tmp[e])
            }
        })
        console.log(nextAddRecipeIngredients)
        this.setState({addRecipeIngredients: nextAddRecipeIngredients})
    }

    handleChipEdit = (chips) => {
        if(this.state.editRecipeIngredients.length == chips.length-1)
            this.setState({editRecipeIngredients: chips})
        else{
            console.log('--------')
            console.log(this.state.editRecipeIngredients)
            console.log(chips)
            console.log('--------')
            let tmp = [...this.state.editRecipeIngredients, chips[chips.length-1]]
            this.setState({editRecipeIngredients: tmp})
        }
    }

    handleChipDeleteEdit = (chip) => {
        console.log(chip)
        var tmp = {...this.state.editRecipeIngredients}
        var nextEditRecipeIngredients = []
        Object.keys(tmp).forEach((e,i) => {
            if(chip != tmp[e]){
                nextEditRecipeIngredients.push(tmp[e])
            }
        })
        
        this.setState({editRecipeIngredients: nextEditRecipeIngredients})
    }


    checkboxSelected = (e, recipeID) => {
        
        if(e.target.checked){
            var newChecked = {...this.state.checkedRecipes, [recipeID]: true}
            this.setState({checkedRecipes: newChecked})
        }else{
            var tmp = {...this.state.checkedRecipes, [recipeID]: true}
            let newChecked = _.omit(tmp, [recipeID])
            this.setState({checkedRecipes: newChecked})
        }

    }


    handleAddRecipe = () => {
        console.log(this.state.addRecipeName)
        console.log(this.state.addRecipeKcal)
        console.log(this.state.addRecipeFat)
        console.log(this.state.addRecipeCarbs)
        console.log(this.state.addRecipeProtein)
        console.log(this.state.addRecipeDiff)
        console.log(this.state.addRecipeGF)
        console.log(this.state.addRecipeVeg)
        console.log(this.state.addRecipePrep)
        console.log(this.state.addRecipeIngredients.toString())
        console.log(this.props.userID)

        

        var isGlutenFree = 0
        var isVegetarian = 0
        let ingredients = this.state.addRecipeIngredients.toString()

        if(this.state.addRecipeGF)
            isGlutenFree = 1
        if(this.state.addRecipeVeg)
            isVegetarian = 1

        
        const sqlQuery = `INSERT INTO recipes (name, calories, fat, carbs, protein, difficulty, isGlutenFree, isVegetarian, instructions, ingredients, owner) VALUES ('${this.state.addRecipeName}',${this.state.addRecipeKcal},${this.state.addRecipeFat},${this.state.addRecipeCarbs},${this.state.addRecipeProtein},${this.state.addRecipeDiff},${isGlutenFree},${isVegetarian},'${this.state.addRecipePrep}','${ingredients}','${this.props.userID}');`

        // console.log(sqlQuery)
                
        Axios.post("http://localhost:3001/api/insert", {
            sqlQuery: sqlQuery
        }).then((res) => {
            if(res.data.status == 'error'){
                console.log(res.data.msg)
                this.setState({snackbarError: true})
            }else{
                this.setState({
                    snackbarSuccess: true,
                    dialogAdd: false,
                    addRecipeName: '',
                    addRecipeKcal: '',
                    addRecipeFat: '',
                    addRecipeCarbs: '',
                    addRecipeProtein: '',
                    addRecipeDiff: '',
                    addRecipeIngredients: [],
                    addRecipePrep: '',
                    addRecipeGF: false,
                    addRecipeVeg: false,
                    addRecipeError: false,
                })
            }
        })
    }



    handleEditRecipe = () => {
        console.log(this.state.editRecipeName)
        console.log(this.state.editRecipeKcal)
        console.log(this.state.editRecipeFat)
        console.log(this.state.editRecipeCarbs)
        console.log(this.state.editRecipeProtein)
        console.log(this.state.editRecipeDiff)
        console.log(this.state.editRecipeGF)
        console.log(this.state.editRecipeVeg)
        console.log(this.state.editRecipePrep)
        console.log(this.state.editRecipeIngredients.toString())
        console.log(this.props.userID)

        

        var isGlutenFree = 0
        var isVegetarian = 0
        let ingredients = this.state.editRecipeIngredients.toString()

        if(this.state.editRecipeGF)
            isGlutenFree = 1
        if(this.state.editRecipeVeg)
            isVegetarian = 1

        
        const sqlQuery = `UPDATE recipes SET name = '${this.state.editRecipeName}', calories = ${this.state.editRecipeKcal}, fat =${this.state.editRecipeFat}, carbs =${this.state.editRecipeCarbs}, protein =${this.state.editRecipeProtein}, difficulty =${this.state.editRecipeDiff}, isGlutenFree =${isGlutenFree}, isVegetarian =${isVegetarian}, instructions ='${this.state.editRecipePrep}', ingredients ='${ingredients}' WHERE recipeID = ${this.state.editRecipeID};`

        Axios.post("http://localhost:3001/api/update", {
                sqlQuery: sqlQuery
            }).then((res) => {
                if(res.data.status == 'error'){
                    console.log(res.data.msg)
                    this.setState({snackbarError: true})
                }else{
                    this.setState({snackbarSuccess: true, dialogEdit: false})
                    this.handleSearch()
                }
            })

        // console.log(sqlQuery)
    }

    handleDelete = () => {

        if(Object.keys(this.state.checkedRecipes).length > 0){
            var sqlQuery = 'DELETE FROM recipes WHERE recipeID IN ('

            Object.keys(this.state.checkedRecipes).forEach((recipeID,index) => {
                if(index == 0)
                    sqlQuery = sqlQuery + recipeID
                else
                    sqlQuery = sqlQuery + ',' + recipeID
            })

            sqlQuery = sqlQuery + ');'

            
            // console.log(sqlQuery)

            Axios.post("http://localhost:3001/api/delete", {
                sqlQuery: sqlQuery
            }).then((res) => {
                if(res.data.status == 'error'){
                    console.log(res.data.msg)
                    this.setState({snackbarError: true})
                }else{
                    console.log(res.data.msg)
                    this.setState({snackbarSuccess: true})
                    this.handleSearch()
                }
            })



        }else{
            this.setState({snackbarError: true})
        }
    }

    handleEdit = () => {
        if(Object.keys(this.state.checkedRecipes).length == 1){
            Object.keys(this.state.checkedRecipes).forEach((recipeID) => {
                var rows = (Object.assign({}, ...this.state.mysqldata.map(item => ({[item['recipeID']]: item}))))
                var tmp = rows[recipeID]
                // console.log(tmp)

                this.setState({
                    editRecipeID: recipeID,
                    editRecipeName: tmp.name,
                    editRecipeKcal: tmp.calories,
                    editRecipeFat: tmp.fat,
                    editRecipeCarbs: tmp.carbs,
                    editRecipeProtein: tmp.protein,
                    editRecipeDiff: tmp.difficulty,
                    editRecipeIngredients: tmp.ingredients.split(','),
                    editRecipePrep: tmp.instructions,
                    editRecipeGF: !!tmp.isGlutenFree,
                    editRecipeVeg: !!tmp.isVegetarian,
                    dialogEdit: true,
                })
                
            })
        }else{
            this.setState({snackbarError: true})
        }
    }


    arrToRows = (arr) => {
        var res = arr.map( (component,index) => {
            return (
                <div>
                    <Divider/>
                    <RecipesRow 
                        key={index}
                        userID={this.props.userID}
                        index={index} 
                        recipeID={component.recipeID} 
                        name={component.name}
                        calories={component.calories}
                        fat={component.fat}
                        carbs={component.carbs}
                        protein={component.protein}
                        isGlutenFree={component.isGlutenFree}
                        isVegetarian={component.isVegetarian}
                        difficulty={component.difficulty}
                        owner={component.owner}
                        isLoading={this.state.isLoading}
                        showRecipe={this.showRecipe} 
                        checkboxSelected={this.checkboxSelected}/>
                </div>
            )
        })

        return res
    }

    render() {
        return(
            <div className={this.props.classes.container}>
                <HeaderBar isFirstLoad={false} userID={this.props.userID} userBMR={this.props.userBMR} container={2} history={this.props.history}/>
                <div className={this.props.classes.card}>
                    <h2 className={this.props.classes.cardHeader}>Search a Recipe</h2>
                    <div className={this.props.classes.padding}>
                        <div className={this.props.classes.titleHeader}>Name:</div>
                        <div>
                            <TextField
                                fullWidth
                                id="lastname"
                                // label="Height"
                                value={this.state.titleSearch}
                                margin="normal"
                                onChange={e => this.setState({ titleSearch: e.target.value})}
                                InputProps={{
                                    startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                    ),
                                }}
                                />

                            





                        </div>
                        
                        <div className={this.props.classes.sliderHeaderContainer}>
                            <div className={this.props.classes.sliderHeader}>
                                {`Kcal: (${this.state.sliderKcal[0]} - ${this.state.sliderKcal[1]})`}
                            </div>
                            <div className={this.props.classes.divider}/>
                            <div className={this.props.classes.sliderHeaderFat}>
                                {`Fat: (${this.state.sliderFat[0]} - ${this.state.sliderFat[1]})`}
                            </div>
                            <div className={this.props.classes.divider}/>
                            <div className={this.props.classes.sliderHeaderCarbs}>    
                                {`Carbs: (${this.state.sliderCarbs[0]} - ${this.state.sliderCarbs[1]})`}
                            </div>
                            <div className={this.props.classes.divider}/>
                            <div className={this.props.classes.sliderHeaderProtein}>
                                {`Protein: (${this.state.sliderProtein[0]} - ${this.state.sliderProtein[1]})`}
                            </div>
                        </div>


                        <div className={this.props.classes.sliderHeaderContainer}>
                            <div className={this.props.classes.sliderHeader}>
                                <Slider
                                    value={this.state.sliderKcal}
                                    onChange={this.handleSliderKcal}
                                    valueLabelDisplay="auto"
                                    getAriaValueText={() => this.valueText}
                                    min={0}
                                    max={1000}
                                />
                            </div>
                            <div className={this.props.classes.dividerHidden}/>
                            <div className={this.props.classes.sliderHeaderFat}>
                                <Slider
                                    value={this.state.sliderFat}
                                    onChange={this.handleSliderFat}
                                    valueLabelDisplay="auto"
                                    // valueLabelDisplay="on"
                                    getAriaValueText={() => this.valueText}
                                    min={0}
                                    max={100}
                                />
                            </div>
                            <div className={this.props.classes.dividerHidden}/>
                            <div className={this.props.classes.sliderHeaderCarbs}>
                                <Slider
                                    value={this.state.sliderCarbs}
                                    onChange={this.handleSliderCarbs}
                                    valueLabelDisplay="auto"
                                    // valueLabelDisplay="on"
                                    getAriaValueText={() => this.valueText}
                                    min={0}
                                    max={100}
                                />
                            </div>
                            <div className={this.props.classes.dividerHidden}/>
                            <div className={this.props.classes.sliderHeaderProtein}>
                                <Slider
                                    value={this.state.sliderProtein}
                                    onChange={this.handleSliderProtein}
                                    valueLabelDisplay="auto"
                                    // valueLabelDisplay="on"
                                    getAriaValueText={() => this.valueText}
                                    min={0}
                                    max={100}
                                />
                            </div>
                        </div>







                        <div className={this.props.classes.diffSliderHeader}>
                            {/* {`Difficulty: (${this.state.difficulty[0]} - ${this.state.difficulty[1]})`} */}
                            Difficulty:
                        </div>
                        <Slider
                            value={this.state.difficulty}
                            onChange={this.handleSliderDifficulty}
                            valueLabelDisplay="auto"
                            getAriaValueText={this.valueText}
                            step={1}
                            marks={marks}
                            min={1}
                            max={5}
                        />
                        <div className={this.props.classes.tagsHeader}>Tags:</div>
                        <div>
                            <div className={this.props.classes.checkboxWrapper}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.isVegetarian} onChange={e => this.setState({ isVegetarian: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Vegetarian</label>
                            </div>
                            <div className={this.props.classes.checkboxWrapper}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.isGlutenFree} onChange={e => this.setState({ isGlutenFree: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Gluten Free</label>
                            </div>
                            
                        </div>
                        <div className={this.props.classes.buttonContainer}>
                            <Button onClick={this.handleSearch} className={this.props.classes.searchButton} variant="contained" color="secondary">Search</Button>
                            
                        </div>
                        
                    </div>
                </div>

                
                <div className={this.props.classes.tableContainer}>

                    <div className={this.props.classes.divicons}>
                        <IconButton className={this.props.classes.icons} onClick={this.handleDelete} aria-label="delete">
                            <Delete fontSize="inherit" />
                        </IconButton>
                        <IconButton className={this.props.classes.icons} onClick={this.handleEdit} aria-label="delete">
                            <Edit fontSize="inherit" />
                        </IconButton>
                        <IconButton className={this.props.classes.icons} aria-label="delete" onClick={() => {this.setState({dialogAdd: true})}}>
                            <AddCircleOutline fontSize="inherit" />
                        </IconButton>
                    </div>
                    <RecipesHeader/>
                    {this.arrToRows(this.state.mysqldata)}
                </div>
                <Dialog  aria-labelledby="simple-dialog-title" open={this.state.dialogPreparation} onClose={() => {this.setState({dialogPreparation: false})}}>
                    <DialogTitle className={this.props.classes.dialogPreparationTitle} id="simple-dialog-title">{this.state.prepRecipeName}</DialogTitle>
                    <Divider/>
                    <div className={this.props.classes.dialogPreparationIngredientsDiv}>
                        <div className={this.props.classes.dialogPreparationIngredientsTitle}>Ingredients:</div>
                        <div className={this.props.classes.dialogPreparationIngredientsData}>
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
                    <DialogTitle className={this.props.classes.dialogPreparationTitle} id="simple-dialog-title">Add Recipe</DialogTitle>
                    <Divider/>
                    <TextField
                        className={this.props.classes.addRecipeName}
                        id="addRecipeName"
                        label="Name"
                        error={this.state.addRecipeError}
                        value={this.state.addRecipeName}
                        onChange={e => this.setState({ addRecipeName: e.target.value })}
                        margin="normal"
                       
                    />
                    <div style={{display: 'flex'}}>
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Kcal"
                            error={this.state.addRecipeError}
                            value={this.state.addRecipeKcal}
                            onChange={e => this.setState({ addRecipeKcal: e.target.value })}
                            margin="normal"
                            type="number"
                            
                        
                        />
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Fat"
                            error={this.state.addRecipeError}
                            value={this.state.addRecipeFat}
                            onChange={e => this.setState({ addRecipeFat: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Carbs"
                            error={this.state.addRecipeError}
                            value={this.state.addRecipeCarbs}
                            onChange={e => this.setState({ addRecipeCarbs: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Protein"
                            error={this.state.addRecipeError}
                            value={this.state.addRecipeProtein}
                            onChange={e => this.setState({ addRecipeProtein: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                    </div>
                    <div className={this.props.classes.dispFlex}>
                        <TextField
                            className={this.props.classes.addRecipeDiff}
                            id="email"
                            label="Difficulty"
                            error={this.state.addRecipeError}
                            value={this.state.addRecipeDiff}
                            onChange={e => this.setState({ addRecipeDiff: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                        <div className={this.props.classes.checkboxContainer}>
                            <div className={this.props.classes.checkboxWrapperAdd}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.addRecipeVeg} onChange={e => this.setState({ addRecipeVeg: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Vegetarian</label>
                            </div>
                            <div className={this.props.classes.checkboxWrapperAdd}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.addRecipeGF} onChange={e => this.setState({ addRecipeGF: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Gluten Free</label>
                            </div>
                            
                        </div>
                    </div>
                    <div className={this.props.classes.dialogPreparationIngredientsDiv}>
                        <div className={this.props.classes.dialogPreparationIngredientsTitle}>Ingredients:</div>
                        <div className={this.props.classes.dialogPreparationIngredientsData}>
                            <ChipInput
                                onChange={(chips) => this.handleChipAdd(chips)}
                                onDelete={(chips) => this.handleChipDeleteAdd(chips)}
                            />
                        </div>
                    </div>
                    
                    <div className={this.props.classes.dialogPreparationIngredientsDiv}>
                        <div className={this.props.classes.dialogPreparationIngredientsTitle}>Preparation:</div>
                        <div className={this.props.classes.dialogPreparationData}>
                            <TextField
                                id="email"
                                fullWidth
                                error={this.state.addRecipeError}
                                value={this.state.addRecipePrep}
                                onChange={e => this.setState({ addRecipePrep: e.target.value })}
                                margin="normal"
                                multiline
                                
                            
                            />
                        </div>
                    </div>
                    
                    <div style={{margin: '24px'}}>
                        <Button onClick={this.handleAddRecipe} style={{backgroundColor: '#ebddbc'}} className={this.props.classes.addButton} variant="contained" color="primary">Add</Button>
                        <Button onClick={() => {this.setState({dialogAdd: false})}} className={this.props.classes.cancelButton} variant="contained" color="secondary">Cancel</Button>
                    </div>
                </Dialog>



                <Dialog  aria-labelledby="simple-dialog-title" open={this.state.dialogEdit} onClose={() => {this.setState({dialogEdit: false})}}>
                    <DialogTitle className={this.props.classes.dialogPreparationTitle} id="simple-dialog-title">{`Edit: ${this.state.editRecipeName}`}</DialogTitle>
                    <Divider/>
                    <TextField
                        className={this.props.classes.addRecipeName}
                        id="addRecipeName"
                        label="Name"
                        error={this.state.editRecipeError}
                        value={this.state.editRecipeName}
                        onChange={e => this.setState({ editRecipeName: e.target.value })}
                        margin="normal"
                       
                    />
                    <div style={{display: 'flex'}}>
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Kcal"
                            error={this.state.editRecipeError}
                            value={this.state.editRecipeKcal}
                            onChange={e => this.setState({ editRecipeKcal: e.target.value })}
                            margin="normal"
                            type="number"
                            
                        
                        />
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Fat"
                            error={this.state.editRecipeError}
                            value={this.state.editRecipeFat}
                            onChange={e => this.setState({ editRecipeFat: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Carbs"
                            error={this.state.editRecipeError}
                            value={this.state.editRecipeCarbs}
                            onChange={e => this.setState({ editRecipeCarbs: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                        <TextField
                            className={this.props.classes.addRecipeNumbers}
                            id="email"
                            label="Protein"
                            error={this.state.editRecipeError}
                            value={this.state.editRecipeProtein}
                            onChange={e => this.setState({ editRecipeProtein: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                    </div>
                    <div className={this.props.classes.dispFlex}>
                        <TextField
                            className={this.props.classes.addRecipeDiff}
                            id="email"
                            label="Difficulty"
                            error={this.state.editRecipeError}
                            value={this.state.editRecipeDiff}
                            onChange={e => this.setState({ editRecipeDiff: e.target.value })}
                            margin="normal"
                            type="number"
                        
                        />
                        <div className={this.props.classes.checkboxContainer}>
                            <div className={this.props.classes.checkboxWrapperAdd}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.editRecipeVeg} onChange={e => this.setState({ editRecipeVeg: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Vegetarian</label>
                            </div>
                            <div className={this.props.classes.checkboxWrapperAdd}>
                                <Checkbox className={this.props.classes.checkbox} checked={this.state.editRecipeGF} onChange={e => this.setState({ editRecipeGF: e.target.checked})}/>
                                <label className={this.props.classes.checkboxLabel}>Gluten Free</label>
                            </div>
                            
                        </div>
                    </div>
                    <div className={this.props.classes.dialogPreparationIngredientsDiv}>
                        <div className={this.props.classes.dialogPreparationIngredientsTitle}>Ingredients:</div>
                        <div className={this.props.classes.dialogPreparationIngredientsData}>
                            <ChipInput
                                onChange={(chips) => this.handleChipEdit(chips)}
                                onDelete={(chips) => this.handleChipDeleteEdit(chips)}
                                value={this.state.editRecipeIngredients}
                            />
                        </div>
                    </div>
                    
                    <div className={this.props.classes.dialogPreparationIngredientsDiv}>
                        <div className={this.props.classes.dialogPreparationIngredientsTitle}>Preparation:</div>
                        <div className={this.props.classes.dialogPreparationData}>
                            <TextField
                                id="email"
                                fullWidth
                                error={this.state.editRecipeError}
                                value={this.state.editRecipePrep}
                                onChange={e => this.setState({ editRecipePrep: e.target.value })}
                                margin="normal"
                                multiline
                                
                            
                            />
                        </div>
                    </div>
                    
                    <div style={{margin: '24px'}}>
                        <Button onClick={this.handleEditRecipe} style={{backgroundColor: '#ebddbc'}} className={this.props.classes.addButton} variant="contained" color="primary">Add</Button>
                        <Button onClick={() => {this.setState({dialogEdit: false})}} className={this.props.classes.cancelButton} variant="contained" color="secondary">Cancel</Button>
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
        backgroundSize: '100%',
        backgroundRepeat: 'repeat-y',
        paddingBottom: '40px'
    },
    selectActivity:{
        textAlign: 'left',
        width: '200px'
        
    },
    card:{
        width: '55%',
        margin: 'auto',
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '1px 1px 4px grey',
        paddingBottom: '30px',
        marginTop: '30px'
    },
    deleteButton: {
        float: 'right',
        width: '90px',
        
    },
    createButton: {
        float: 'right',
        width: '90px',
        marginLeft: 7,
    },
    cardHeader:{
        marginTop: '0px',
        marginBottom: '0px',
        paddingTop: '20px',
        paddingBottom: '20px',
        paddingLeft: '30px',
        color: '#b03508',
        backgroundColor: '#ebddbc',
        borderRadius: '5px 5px 0px 0px', 

    },
    tagsHeader:{
        marginBottom: '10px',
        marginTop: '25px',
        fontWeight: '600',
        fontSize: '18px',
    },
    
    chip:{
        marginBottom: '10px',
        marginRight: '15px',
        fontWeight: '700',
        fontSize: '14px',
        boxShadow: '1px 1px 4px grey',
    },
    mealPlan:{
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '1px 1px 4px grey',
        padding: '30px',
        paddingTop: '15px',
        marginTop: '30px',
        marginBottom: '30px',
        marginLeft: '20px',
        marginRight: '20px',
    },
    padding: {
        paddingLeft: '30px',
        paddingRight: '30px',
    },
    diffSliderHeader:{
        marginTop: '30px',
        marginBottom: '10px',
        fontWeight: '600',
        fontSize: '18px',
    },
    dispFlex:{
        display: 'flex'
    },


    sliderHeader:{
        marginTop: '30px',
        marginBottom: '10px',
        fontWeight: '600',
        fontSize: '16px',
        width: '180px',
        textAlign: 'center'
    },
    checkboxContainer:{
        display: 'flex',
        marginTop: '29px'
    },
    checkboxWrapper:{
        marginRight: '10px'
    },
    checkboxWrapperAdd:{
        marginRight: '10px',
        marginLeft: '50px'
    },
    checkbox:{
        padding: '5px',
    },
    checkboxLabel:{
        verticalAlign: 'middle'
    },
    titleHeader:{
        marginBottom: '0px',
        marginTop: '25px',
        fontWeight: '600',
        fontSize: '18px',
    },
    searchButton:{
        float: 'right',
        width: '90px',
        marginTop: '5px',
        color: '#ebddbc',
        backgroundColor: '#b03508',
        fontWeight: '600'
    },
    buttonContainer:{
        height: '35px'
    },
    tableContainer:{
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '0px 0px 4px grey',
        marginTop: '30px',
        marginBottom: '30px',
        marginLeft: '20px',
        marginRight: '20px',
    },
    sliderHeaderContainer:{
        display: 'flex',
    },
    divider:{
        width: '1px',
        backgroundColor: '#6f1e01',
        marginLeft: '15px',
        marginRight: '15px',
        marginTop: '30px',
        marginBottom: '10px'
    },
    dividerHidden:{
        width: '1px',
        marginLeft: '15px',
        marginRight: '15px',
        marginTop: '30px',
        marginBottom: '10px'
    },
    sliderHeaderProtein:{
        width: '178px',
        marginTop: '30px',
        marginBottom: '10px',
        fontWeight: '600',
        fontSize: '16px',
        textAlign: 'center'
    },
    sliderHeaderFat:{
        width: '147px',
        marginTop: '30px',
        marginBottom: '10px',
        fontWeight: '600',
        fontSize: '16px',
        textAlign: 'center'
    },
    sliderHeaderCarbs:{
        width: '168px',
        marginTop: '30px',
        marginBottom: '10px',
        fontWeight: '600',
        fontSize: '16px',
        textAlign: 'center'
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
    dialogPreparationIngredientsData:{

    },
    divicons:{
        backgroundColor: '#b03508'
    },
    icons:{
        color: '#ebddbc',
    },
    addRecipeName:{
        marginLeft: '24px',
        width: '350px',
    },
    addRecipeNumbers:{
        marginLeft: '24px',
        marginRight: '24px',
    },
    addRecipeDiff:{
        marginLeft: '24px',
        width: '80px',
    },
    cancelButton: {
        float: 'right',
        width: '90px',
        color: '#ebddbc',
        backgroundColor: '#b03508',
        fontWeight: '600'
    },
    addButton: {
        float: 'right',
        width: '90px',
        marginLeft: 7,
        color: '#b03508',
        backgroundColor: '#ebddbc',
        fontWeight: '600'
    },
    
});

export default withStyles(styles)(Recipes);