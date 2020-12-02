import React, { Component } from 'react';

import MealPlanCard from './MealPlanCard'

import { withStyles, Grid } from '@material-ui/core';


const styles = theme => ({
    container: {
        display: 'flex',
        marginTop: '10px',
        paddingLeft: '35px',
        paddingRight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
    },
    card: {
        width: '140px',
        paddingTop: '10px',
        fontSize: '20px',
        fontWeight: '600',
        color: 'white'
    },
    line:{
        width: '2px',
        backgroundColor: 'red'
    },
    
});



class MealPlanRow extends Component {

    weekToDays = (week) => {
        var gridxs = 3
        if(week.length == 3){
            gridxs = 4
        }
        var res = week.map( (component,index) => {
            return (
                <Grid item xs={gridxs} key={index}>
                    <MealPlanCard
                        userID={component.userID}
                        recipeID={component.recipeID} 
                        name={component.name}
                        calories={component.calories}
                        fat={component.fat}
                        carbs={component.carbs}
                        protein={component.protein}
                        isGlutenFree={component.isGlutenFree}
                        isVegetarian={component.isVegetarian}
                        showRecipe={this.props.showRecipe} 


                        nMeal={index}
                        nDay={this.props.nDay-1}

                        headerColor= {`${this.props.backColor}3d`}
                    />
                </Grid>
            )
        })

        return res
    }

    render() {
        return (
            <div style={{backgroundColor: this.props.backColor}} className={this.props.classes.container}>
                <div className={this.props.classes.card} >
                    {`DAY ${this.props.nDay}`}        
                </div>
                
                <Grid container spacing={3}>
                    {this.weekToDays(this.props.weekMeals)}
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(MealPlanRow);