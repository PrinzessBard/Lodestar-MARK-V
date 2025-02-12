import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image, TouchableOpacity} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

const API_URL_UPLOAD = "http://192.168.0.28:5000/upload"
// const API_URL_PHOTO = "@/assets/icon"

const getValue = async (key: string) => {
  return await SecureStore.getItemAsync(key) 
}

class Indoor extends React.Component<{}, { modalVisible: boolean, uploadData: [], to: string, API_URL_PHOTO: string, reloadData: number[] }> {
  constructor(props: any) {
    super(props)
    this.state = {
      modalVisible: false,
      uploadData: [],
      to: '',
      API_URL_PHOTO: '@/assets/icon', // 'http://192.168.0.28:5000/photo1' // '@/assets/icon'
      reloadData: [1, 0, 3, 1, 5, 2]
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.reRender = this.reRender.bind(this)
  }

  reRender = async () => {
    const response = await axios.get(API_URL_UPLOAD);

    alert(response)
  };

  handleInputChange = (input: any) => {
    this.setState({to: input})
  }


  handleSubmit = async () => {
    this.setState({modalVisible: !this.state.modalVisible})

    var sendData = {
      "coordinates": {
        "latitude": await getValue('latitude'),
        "longitude": await getValue('longitude')
      },
      "start_room_name": "медиацентр",
      "end_room_name": this.state.to
    }

    const response = await axios.post(API_URL_UPLOAD, sendData);
    this.setState({uploadData: response.data});

    // alert(response.data)

    this.setState({to: ""})
    this.setState({API_URL_PHOTO: 'http://192.168.0.28:5000/photo1'})
  };

  render(): React.ReactNode {
    return (
      <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          this.setState({modalVisible: !this.state.modalVisible});
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput style={styles.modalInput}
                      placeholderTextColor="#2F4F4F" 
                      placeholder='Куда?'
                      onChangeText={this.handleInputChange}
                      value={this.state.to} />
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={this.handleSubmit}>
              <Text style={styles.textStyle}>Contunue </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Image
          style={styles.image}
          source={{
            uri: this.state.API_URL_PHOTO,
          }}
        />

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={this.reRender}>
        <Text style={styles.buttonText}>Открыть меню</Text>
      </Pressable>
      
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => this.setState({modalVisible: true})}>
        <Text style={styles.buttonText}>Открыть меню</Text>
      </Pressable>
    </View>
    )
  }


}




// const Indoor = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [uploadData, setUploadData] = useState([]);
//   const [photoData, setPhotoData] = useState("@/assets/icon");

//   const [to, setTo] = useState('');

//   const handleInputChange = (input: any) => {
//     setTo(input);
//   }

//   const handleSubmit = async () => {
//     setModalVisible(!modalVisible)

//     var sendData = {
//       "coordinates": {
//         "latitude": await getValue('latitude'),
//         "longitude": await getValue('longitude')
//       },
//       "start_room_name": "user",
//       "end_room_name": to
//     }

//     try {
//       const response = await axios.post(API_URL_UPLOAD, sendData);
//       setUploadData(response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }

//     // try {
//     //   const response = await axios.get(API_URL_PHOTO);
//     //   setPhotoData(response.request);
//     // } catch (error) {
//     //   console.error('Error fetching data:', error);
//     // }


//     console.log(uploadData);

//     // console.log(photoData);

//     setTo("")
//   };

//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           Alert.alert('Modal has been closed.');
//           setModalVisible(!modalVisible);
//         }}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <TextInput style={styles.modalInput}
//                       placeholderTextColor="#2F4F4F" 
//                       placeholder='Куда?'
//                       onChangeText={handleInputChange}
//                       value={to} />
//             <Pressable
//               style={[styles.button, styles.buttonClose]}
//               onPress={handleSubmit}>
//               <Text style={styles.textStyle}>Contunue</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       <Image
//           style={styles.image}
//           source={{
//             uri: API_URL_PHOTO,
//           }}
//         />
//       <Pressable
//         style={[styles.button, styles.buttonOpen]}
//         onPress={() => setModalVisible(true)}>
//         <Text style={styles.buttonText}>Открыть меню</Text>
//       </Pressable>
//     </View>
//   );
// };

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
