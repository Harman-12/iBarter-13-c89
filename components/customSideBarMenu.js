import React, { Component} from 'react';
import {View, Text,TouchableOpacity} from 'react-native';
import { DrawerItems} from 'react-navigation-drawer'

import { Avatar } from 'react-native-elements';

import * as ImagePicker from 'expo-image-picker';

import * as Permissions from 'expo-permissions';

import * as firebase from 'firebase'
import 'firebase/firestore';
import db from '../config';

export default class customSideBarMenu extends Component{

  state = {
    userId: firebase.auth().currentUser.email,
    image: "#",
    name: "",
    docId: "",
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
  }


  render(){
    return(
      <View style={{flex:1}}>
      
        <View
          style={{
            flex: 0.9,

            alignItems: "center",
            backgroundColor: "orange",
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="xlarge"
            onPress={() => this.selectPicture()}
            containerStyle={{
              marginTop: 30,
              borderRadius: 40,
              alignSelf: 'center'
            }}
            showEditButton
          />

          <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10 }}> {this.state.name} </Text>
        </View>
        <View style={{flex: 0.8}}>
        <DrawerItems {...this.props}/>
        </View>
        <View style={{flex:1,justifyContent:'flex-end',paddingBottom:30}}>
          <TouchableOpacity style={{justifyContent:'center',padding:10,height:30,width:'100%', backgroundColor: 'blue'}}
          onPress = {() => {
              this.props.navigation.navigate('WelcomeScreen')
              firebase.auth().signOut()
          }}>
            <Text style={{color: 'white', fontSize: 17, textAlign: 'center'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}