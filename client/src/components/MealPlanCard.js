import React, { Component } from 'react';


import { withStyles, Divider, Button } from '@material-ui/core';




const styles = theme => ({
    container: {
        backgroundColor: 'white',
        borderRadius: '5px',
        boxShadow: '1px 1px 4px grey'
    },
    title: {
        padding : '10px',
        fontSize: '20px',
        fontWeight: '700'
    },
    nutFacts:{
        padding : '10px',
        fontSize: '15px',
        fontWeight: '600'
    },
    nutFactsData:{
        marginLeft: '15px',
        marginTop: '5px',
        fontSize: '13px',
        fontWeight: '400'
    },
    newLine:{
        marginBottom: 0,
        marginTop: 3,
    },
    prep:{
        fontWeight: '600',
        fontSize: '25px',
        textAlign: 'center'
    },
    ingredientsData:{
        marginTop: '10px',
        fontWeight: '400'
    },
    chip:{
        marginTop: '2px',
        marginRight: '2px'
    },
    prepButton:{
        width: '100%',
        backgroundColor: '#ebddbc',
        color: 'rgb(176, 53, 8)',
        fontWeight: '600',
        textAlign: 'center'
    }
});


class MealPlanCard extends Component {

    render() {
        return (
            <div className={this.props.classes.aa}>
                <div className={this.props.classes.container}>
                    <div style={{backgroundColor: this.props.headerColor}} className={this.props.classes.title}>{this.props.name}</div>
                    <Divider/>
                    <div className={this.props.classes.nutFacts}>
                        Nutritional Facts:
                        <div className={this.props.classes.nutFactsData}>
                            <span>• </span><span>{`Kcal: ${this.props.calories}`}</span><p className={this.props.classes.newLine}/>
                            <span>• </span><span>{`Protein: ${this.props.protein}`}</span><p className={this.props.classes.newLine}/>
                            <span>• </span><span>{`Fat: ${this.props.fat}`}</span><p className={this.props.classes.newLine}/>
                            <span>• </span><span>{`Carbs: ${this.props.carbs}`}</span><p className={this.props.classes.newLine}/>
                        </div>
                    </div>
                    <Divider/>
                    <div className={this.props.classes.prep}>
                        <Button variant="contained" disableElevation className={this.props.classes.prepButton} onClick={() => this.props.showRecipe(this.props.recipeID, this.props.nMeal, this.props.nDay)}>
                            Preparation
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(MealPlanCard);