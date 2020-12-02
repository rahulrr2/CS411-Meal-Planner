import React, { Component } from 'react';

import { withStyles, Grid } from '@material-ui/core';

const styles = theme => ({
    container: {
        display: 'flex',
        marginTop: '10px',
        paddingLeft: '35px',
        paddingRight: '20px',
        paddingTop: '20px',
        paddingBottom: '10px',
    },
    card: {
        width: '140px',
        paddingTop: '10px',
        fontSize: '20px',
        fontWeight: '600'
    },
    line:{
        width: '2px',
        backgroundColor: 'red'
    },
    textCenter:{
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '600'
    }
});


class RowHeader extends Component {

    renderGrids = (meals) =>{
        if (meals == 3){
            return (<Grid container spacing={3}>
                <Grid item xs={4}>
                    <div className={this.props.classes.textCenter}>Breakfast</div>
                </Grid>
                <Grid item xs={4}>
                    <div className={this.props.classes.textCenter}>Lunch</div>
                </Grid>
                <Grid item xs={4}>
                    <div className={this.props.classes.textCenter}>Dinner</div>
                </Grid>
            </Grid>)
        }else if (meals == 4){
            return(<Grid container spacing={3}>
                <Grid item xs={3}>
                    <div className={this.props.classes.textCenter}>Breakfast</div>
                </Grid>
                <Grid item xs={3}>
                    <div className={this.props.classes.textCenter}>Brunch</div>
                </Grid>
                <Grid item xs={3}>
                    <div className={this.props.classes.textCenter}>Lunch</div>
                </Grid>
                <Grid item xs={3}>
                    <div className={this.props.classes.textCenter}>Dinner</div>
                </Grid>
            </Grid>)
        }
    } 

    render() {
        return (
            <div className={this.props.classes.container}>
                <div className={this.props.classes.card} />
                {this.renderGrids(this.props.meals)}
            </div>
        );
    }
}

export default withStyles(styles)(RowHeader);