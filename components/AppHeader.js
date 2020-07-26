import React, { Component} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Header , Icon, Badge } from 'react-native-elements';
import * as firebase from 'firebase'
import 'firebase/firestore';
import db from '../config';

export default class AppHeader extends Component{
    constructor(props){
      super(props)
      this.state={
        userId : firebase.auth().currentUser.email,
        value:""
      }
    }

    getNumberOfUnreadNotifications(){
        db.collection('all_notifications').where('notification_status','==',"unread").where('targeted_user_id','==',this.state.userId)
        .onSnapshot((snapshot)=>{
          var unreadNotifications = snapshot.docs.map((doc) => doc.data())
          this.setState({
            value: unreadNotifications.length
          })
        })
      }
    
    componentDidMount(){
        this.getNumberOfUnreadNotifications()
    }

      BellIconWithBadge=()=>{
        return(
          <View>
            <Icon name='bell' type='font-awesome' color='blue' size={25}
              onPress={() =>this.props.navigation.navigate('Notifications')}/>
             <Badge
              value={this.state.value}
              badgeStyle={{backgroundColor: '#ff6600'}}
             containerStyle={{ position: 'absolute', top: -4, right: -4 }}/>
          </View>
        )
      }

    render(){
        return (
            
                <Header 
                    containerStyle={{borderBottomColor:'blue', borderBottomWidth:2}}
                    placement="center"
                    backgroundColor = {'white'}
                    leftComponent={<Icon name='bars' type='font-awesome' color='blue' onPress={() => this.props.navigation.toggleDrawer()}/>}
                    rightComponent={<this.BellIconWithBadge {...this.props}/>}
                    centerComponent = {{
                        text : 'iBarter App',
                        style : { color: '#ff6100', fontSize: 21}
                    }}
                    />
        
            );
        }
}
            


const styles = StyleSheet.create({
    tinyLogo: {
      width: 40,
      height: 40,
    }
});