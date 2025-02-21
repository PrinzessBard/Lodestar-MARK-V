import React, { useState } from 'react';
import MapView, { LatLng, Point } from 'react-native-maps';
import { StyleSheet, View, Alert, NativeSyntheticEvent } from 'react-native';
import { Link, Redirect, useRouter } from 'expo-router';
import { Modal } from 'react-native';
import { Text } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

type Marker = {
  coordinate: LatLng,
  oint: Point
}

const saveValue = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value)
}

export default function Maps() {   
  const router = useRouter(); 

  function redirectIndoor(r: NativeSyntheticEvent<{ coordinate: LatLng; position: Point; }>) {

    // setMarker(r)
    console.log(r.nativeEvent.coordinate);
    saveValue("latitude", r.nativeEvent?.coordinate["latitude"].toString());
    saveValue("longitude", JSON.stringify(r.nativeEvent?.coordinate["longitude"].toString()));
    
    Alert.alert("Indoor", "Indoor?", [
      {
        text: "Yes",
        onPress: () => {
          // saveValue("latitude", JSON.stringify(r.nativeEvent?.coordinate["latitude"].toString()));
          // saveValue("longitude", JSON.stringify(r.nativeEvent?.coordinate["longitude"].toString()));
          // console.log(r.nativeEvent.coordinate);
          router.replace('/indoor');
        }
      },
      {
        text: "No",
        onPress: () => console.log("No")
      }
    ]);
  }

  return (
    <View style={styles.container}>
      <MapView
        style = {styles.map}
        region={{
          latitude: 53.43988484166453,
          longitude: 35.999813606706276,
          latitudeDelta: 0.04, // зум
          longitudeDelta: 0.0321, // зум
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={redirectIndoor}
      />

      <View style={styles.linkContainer} >
        <Link style={{ color: '#fff', fontSize: 20, marginBottom: 15 }} href='/'>Back</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111317"
  },
  map: {
    width: '100%',
    height: '90%',
  },
  linkContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
  },

});
