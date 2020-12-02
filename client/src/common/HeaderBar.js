import React, { Component } from 'react';

import { withStyles, IconButton } from '@material-ui/core';
import { AccountCircle, MeetingRoom, Fastfood, MenuBook } from '@material-ui/icons';


class HeaderBar extends Component {

    profileClick = () => {
        if(this.props.container !== 0)
            this.props.history.push(`/profile/${this.props.userID}`);
    }

    mealPlannerClick = () => {
        if(this.props.container !== 1)
            this.props.history.push(`/mealPlanner/${this.props.userID}/${this.props.userBMR}`);
    };

    recipesClick = () => {
        if(this.props.container !== 2)
            this.props.history.push(`/recipes/${this.props.userID}/${this.props.userBMR}`);
    }


    logoutClick = () => {
        this.props.history.push('/');
    }

  render = () => {
    return (
      <div className={this.props.classes.headerContainer}>
          <div className={this.props.classes.leftIcons}>
            <IconButton className={this.props.classes.icons} aria-label="delete" onClick={this.profileClick}>
                <AccountCircle fontSize="inherit" />
            </IconButton>
            <IconButton disabled={!this.props.userBMR || this.props.isFirstLoad} className={this.props.classes.icons} aria-label="delete" onClick={this.mealPlannerClick}>
                <Fastfood fontSize="small" />
            </IconButton>
            <IconButton disabled={!this.props.userBMR || this.props.isFirstLoad} className={this.props.classes.icons} aria-label="delete" onClick={this.recipesClick}>
                <MenuBook />
            </IconButton>
          </div>
          <div>
            <IconButton className={this.props.classes.icons} aria-label="delete" onClick={this.logoutClick}>
                <MeetingRoom />
            </IconButton>
          </div>
      </div>
    );
  }
}

const styles = theme => ({
    headerContainer: {
      display: 'flex',
      backgroundColor: '#b03406',
      boxShadow: '0px 0px 4px black',
    },
    leftIcons:{
        flex: '1'
    },
    icons:{
      color: 'rgb(236 221 188)'
    }
  });

export default withStyles(styles)(HeaderBar);