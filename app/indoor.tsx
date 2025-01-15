import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const getValue = async (key: string) => {
  return await SecureStore.getItemAsync(key)
}

const Indoor = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [to, setTo] = useState('');

  const handleInputChange = (input: any) => {
    setTo(input);
  }
// 
  const handleSubmit = async () => {
    setModalVisible(!modalVisible)

    // var data = {
    //     "coordinates": {
    //       "latitude": await getValue('latitude'),
    //       "longitude": await getValue('latitude')
    //     },
    //     "start_room_name": "user",
    //     "end_room_name": to
    // }
    
    // fetch("http://217.171.146.102:5000/upload", {
    //     method: "POST",
    //     body:  JSON.stringify(data)
    // })
    // .then(function(response){ 
    //   return response.json();   
    // })
    // .then(function(data){ 
    //   console.log(data)
    // });

    // var data = await SecureStore.getItemAsync('latitude')

    console.log("Latitude: " + await getValue('latitude'));
    console.log("Longitude: " + await getValue('longitude'));
    setTo("")
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={styles.modalInput}
                      placeholderTextColor="#2F4F4F" 
                      placeholder='Куда?'
                      onChangeText={handleInputChange}
                      value={to} />
            <TextInput style={styles.modalInput}
                      placeholderTextColor="#2F4F4F" 
                      placeholder='Откуда?'
                      onChangeText={handleInputChange}
                      value={to} />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleSubmit}>
              <Text style={styles.textStyle}>Contunue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Image
          style={styles.image}
          source={require('@/assets/images/level_1.jpg')}
        />
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Открыть меню</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: '#111317'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
    borderRadius: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    height: 25,
    width: 190, 
    borderColor: 'gray', 
    borderWidth: 2,
    borderRadius: 5,
    borderStartColor: 'yellow',
    borderEndColor: 'yellow',
    borderBlockColor: 'yellow',
    marginBottom: 20,
    color: 'white'
  },
  image: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
    // marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    paddingStart: 90,
    paddingEnd: 90
  },
});

export default Indoor;