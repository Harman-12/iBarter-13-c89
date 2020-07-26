import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Icon,ListItem} from 'react-native-elements'
import AppHeader from '../components/AppHeader'

import * as firebase from 'firebase'
import 'firebase/firestore';
import db from '../config';

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       userName : "",
       allBarters : []
     }
     this.requestRef= null
   }

   getDonorDetails=(userId)=>{
    db.collection("users").where("username","==", userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        this.setState({
          "userName" : doc.data().first_name + " " + doc.data().last_name
        })
      });
    })
  }

   getAllBarters =()=>{
     this.requestRef = db.collection("all_barters").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
      var allBarters = []
      snapshot.docs.map((doc) =>{
        var donation = doc.data()
        donation["doc_id"] = doc.id
        allBarters.push(donation)
      });
      this.setState({
        allBarters : allBarters
      });
     })
   }

   sendItem=(itemDetails)=>{
    if(itemDetails.request_status === "Item Sent"){
      var requestStatus = "Donor Interested"
      db.collection("all_barters").doc(itemDetails.doc_id).update({
        "request_status" : "Donor Interested"
      })
      this.sendNotification(itemDetails,requestStatus)
    }
    else{
      var requestStatus = "Item Sent"
      db.collection("all_barters").doc(itemDetails.doc_id).update({
        "request_status" : "Item Sent"
      })
      this.sendNotification(itemDetails,requestStatus)
    }
  }

   sendNotification=(itemDetails,requestStatus)=>{
    var exchangeId = itemDetails.exchange_id
    var donorId = itemDetails.donor_id
     db.collection("all_notifications")
     .where("exchangeId",'==',exchangeId)
     .where("donor_id","==",donorId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(requestStatus === "Item Sent"){
           message = this.state.userName + " sent you item"
         }else{
            message =  this.state.userName  + " has shown interest in exchanging the item"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message": message,
           "notification_status" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.item_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="exchange" type="font-awesome" color ='orange'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity style={[
            styles.button,
            {
              backgroundColor : item.request_status === "Item Sent" ? "blue" : "#ff5722"
            }
          ]}
          onPress = {()=>{
            this.sendItem(item)
          }}
         >
           <Text style={{color:'#ffff'}}>{
             item.request_status === "Item Sent" ? "Item Sent" : "Send Item"
           }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getAllBarters()
     this.getDonorDetails(this.state.userId)
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <AppHeader navigation ={this.props.navigation}/>
         <View style={{flex:1}}>
           {
             this.state.allBarters.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all Barter Exchanges</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             )
           }
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})