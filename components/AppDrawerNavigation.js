import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';

import SettingsScreen from '../screens/SettingsScreen';
import customSideBarMenu from '../components/customSideBarMenu';
import {bottomTabNavigator} from '../components/bottomTabNavigator';
import MyBartersScreen from '../screens/MyBartersScreen';
import Notifications from '../screens/Notifications';

import {Icon} from 'react-native-elements';

export const AppDrawerNavigation = createDrawerNavigator({
    Home : {
      screen : bottomTabNavigator,
      navigationOptions:{
        drawerIcon : <Icon name="home" type ="fontawesome5" />
      }
    },
    MyBarters:{
      screen : MyBartersScreen,
      navigationOptions:{
        drawerIcon : <Icon name="gift" type ="font-awesome" />,
        drawerLabel : "My Received Books"
      }
    },
    Notifications:{
      screen: Notifications,
      navigationOptions:{
        drawerIcon : <Icon name="bell" type ="font-awesome" />,
        drawerLabel : "Notifications"
      }
    },
    Settings : {
      screen : SettingsScreen,
      navigationOptions:{
        drawerIcon : <Icon name="settings" type ="font-awesome" />,
        drawerLabel : "My Received Books"
      }
    }
    },
    {
      contentComponent:customSideBarMenu
    },
    {
      initialRouteName : 'Home',
     
    })