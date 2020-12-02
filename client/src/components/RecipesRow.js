import React, { Component } from 'react';



import { withStyles, Checkbox, Chip, IconButton } from '@material-ui/core';
import { Visibility } from '@material-ui/icons';




const styles = theme => ({
    lightcontainer: {
        backgroundColor: 'white',
        display: 'flex',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
    },
    darkcontainer: {
        backgroundColor: 'rgb(245,245,245)',
        display: 'flex',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '10px',
        paddingBottom: '10px',
    },

    divider:{
        width: '1px',
        marginLeft: '15px',
        marginRight: '15px',
    },
    name:{
        minWidth: '350px',
        maxWidth: '350px',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    kcal:{
        minWidth: '80px',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    difficulty:{
        minWidth: '70px',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    vegetarian:{
        width: '82px',
        minWidth: '82px',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    gf:{
        width: '88px',
        minWidth: '88px',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    checkbox:{
        padding: 0,
        color: 'green !important'
    },
    chip:{
        marginTop: '2px',
        marginRight: '2px',
        backgroundColor: '#b03508',
        color: 'white',
        fontWeight: '600'
    },
    fat:{
        minWidth: '60px',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    carbs:{
        minWidth: '60px',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    protein:{
        minWidth: '60px',
        textAlign: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
    },
    preparation:{
        minWidth: '88px',
        
    },
    icons:{
        color: '#b03508',
        padding: '0px',
        marginLeft: '32px'
    },
    checkboxMark:{
        width: '40px',
        minWidth: '40px',
        textAlign: 'center'
    },
    checkboxSelect:{
        padding: 0,
        color: '#b03508 !important'
    },

});



class RecipesRow extends Component {

    constructor(props) {
        super(props);
        this.state = {  
            checked: false,
        };
    }

    componentWillMount = () =>{
        
    }

    handleChecked =  (e)  =>{
        this.setState({checked: !this.state.checked})
        return this.props.checkboxSelected(e, this.props.recipeID)
    }

    render() {
        if(this.props.isLoading && this.state.checked){
            this.setState({checked: false})
        }
        return (
            <div className={this.props.index%2 == 0 ? this.props.classes.darkcontainer : this.props.classes.lightcontainer}>
                <div className={this.props.classes.checkboxMark}>
                    { this.props.owner==`${this.props.userID}` && <Checkbox color="secondary" checked={!this.props.isLoading && this.state.checked} className={this.props.classes.checkboxSelect} onChange={this.handleChecked}/>}
                </div>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.name}>{this.props.name}</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.kcal}>{this.props.calories}</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.fat}>{this.props.fat}</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.carbs}>{this.props.carbs}</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.protein}>{this.props.protein}</label>
                <div className={this.props.classes.divider}/>
                <label className={this.props.classes.difficulty}>{this.props.difficulty}</label>
                <div className={this.props.classes.divider}/>
                

                <div className={this.props.classes.vegetarian}>
                    <Checkbox checked={!!this.props.isVegetarian} color="primary" className={this.props.classes.checkbox} disabled/>
                </div>
                <div className={this.props.classes.divider}/>
                <div className={this.props.classes.gf}>
                    <Checkbox checked={!!this.props.isGlutenFree} color="primary" className={this.props.classes.checkbox} disabled/>
                </div>
                <div className={this.props.classes.divider}/>
                <IconButton className={this.props.classes.icons} aria-label="delete" onClick={() => this.props.showRecipe(this.props.recipeID)}>
                    <Visibility />
                </IconButton>
            </div>
        );
    }
}

export default withStyles(styles)(RecipesRow);