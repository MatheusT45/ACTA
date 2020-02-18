import React from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Header from "../components/Header";
import LeftDrawer from "../components/LeftDrawer";
import Data from "../data";
import Dashboard from "./Dashboard/DashboardPage";
import Home from "./RuleList";
import Form from "./Form/FormPage";
import Rule from "./RulePage";
import BasicTable from "./Table/BasicTables";
import DataTable from "./Table/DataTables";
import NotFound from "./NotFoundPage";
import { ThemeProvider } from "@material-ui/core/styles";
import defaultTheme, { customTheme } from "../theme";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { isAuthenticated } from '../services/auth';
import { bindActionCreators } from 'redux';
import api from '../services/api';

import * as userActions from '../_actions/user'

const styles = () => ({
  container: {
    margin: "80px 20px 20px 15px",
    paddingLeft: defaultTheme.drawer.width,
    [defaultTheme.breakpoints.down("sm")]: {
      paddingLeft: 0
    }
  },
  containerFull: {
    paddingLeft: defaultTheme.drawer.miniWidth,
    [defaultTheme.breakpoints.down("sm")]: {
      paddingLeft: 0
    }
  },
  settingBtn: {
    top: 80,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
    width: 48,
    right: 0,
    height: 48,
    opacity: 0.9,
    padding: 0,
    zIndex: 999,
    position: "fixed",
    minWidth: 48,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    // nav bar default open in desktop screen, and default closed in mobile screen
    this.state = {
      theme: defaultTheme,
      navDrawerOpen:
        window && window.innerWidth && window.innerWidth >= defaultTheme.breakpoints.values.md
          ? true
          : false
    };

    this.handleChangeNavDrawer = this.handleChangeNavDrawer.bind(this);
    this.handleChangeTheme = this.handleChangeTheme.bind(this);

    // Get user data
    api.get('/')
    this.props.SaveUserData()

    console.log(this.props.user)
  }

  handleChangeNavDrawer() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  }

  handleChangeTheme(colorOption) {
    const theme = customTheme({
      palette: colorOption
    });
    this.setState({
      theme
    });
  }

  render() {
    const { classes } = this.props;
    const { navDrawerOpen, theme } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Header handleChangeNavDrawer={this.handleChangeNavDrawer} navDrawerOpen={navDrawerOpen} />

        <LeftDrawer
          userName={this.props.user.name}
          isLogged={isAuthenticated()}
          navDrawerOpen={navDrawerOpen}
          handleChangeNavDrawer={this.handleChangeNavDrawer}
          menus={Data.menus}
        />
        <div className={classNames(classes.container, !navDrawerOpen && classes.containerFull)}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/form" component={Form} />
            <Route path="/regra/:rule" component={Rule} />
            <Route path="/table/basic" component={BasicTable} />
            <Route path="/table/data" component={DataTable} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </ThemeProvider>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  classes: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(userActions, dispatch);


export default compose( withStyles(styles), connect(mapStateToProps, mapDispatchToProps) )(App);;
