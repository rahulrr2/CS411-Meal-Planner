import React, { Component } from 'react';

import { withStyles, Grid } from '@material-ui/core';

const styles = theme => ({
    container: {
        display: 'flex',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '20px',
        paddingBottom: '20px',
        fontSize: '16px',
        fontWeight: '600',
        backgroundColor: '#ebddbc',
        color: 'white',
        borderRadius: '5px 5px 0px 0px'
    },

    divider:{
        width: '1px',
        backgroundColor: '#6f1e01',
        marginLeft: '15px',
        marginRight: '15px',
    },
    dividerHidden:{
        width: '1px',
        marginLeft: '15px',
        marginRight: '15px',
    },
    name:{
        minWidth: '350px',
        color: '#6f1e01',
    },
    kcal:{
        minWidth: '80px',
        textAlign: 'center',
        color: '#6f1e01',
    },
    difficulty:{
        minWidth: '70px',
        textAlign: 'center',
        color: '#6f1e01',
    },
    vegetarian:{
        minWidth: '82px',
        color: '#6f1e01',
    },
    gf:{
        minWidth: '88px',
        color: '#6f1e01',
    },
    ingredients:{
        color: '#6f1e01',
        width: '100%'
    },
    fat:{
        minWidth: '60px',
        textAlign: 'center',
        color: '#6f1e01',
    },
    carbs:{
        minWidth: '60px',
        textAlign: 'center',
        color: '#6f1e01',
    },
    protein:{
        minWidth: '60px',
        textAlign: 'center',
        color: '#6f1e01',
    },
    preparation:{
        minWidth: '88px',
        color: '#6f1e01',
    },
    checkboxMark:{
        minWidth: '40px',
        color: '#6f1e01',
    }

});


class RowHeader extends Component {


    render() {
        return (
            <div className={this.props.classes.container}>
                <label className={this.props.classes.checkboxMark}></label>
                <div className={this.props.classes.dividerHidden}/>
                <label className={this.props.classes.name}>Name</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.kcal}>Kcal</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.fat}>Fat</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.carbs}>Carbs</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.protein}>Protein</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.difficulty}>Difficulty</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.vegetarian}>Vegetarian</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.gf}>Gluten Free</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.gf}>Preparation</label>
                
            </div>
        );
    }
}

export default withStyles(styles)(RowHeader);