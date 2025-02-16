import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image, TouchableOpacity, ImageSourcePropType} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

const API_URL_UPLOAD = "http://192.168.0.28:5000/upload"

const getValue = async (key: string) => {
  return await SecureStore.getItemAsync(key) 
}

// class Indoor extends React.Component<{}, { modalVisible: boolean, to: string, photo: string}> {
//   constructor(props: any) {
//     super(props)
//     this.state = {
//       modalVisible: false,
//       to: '',
//       photo: '',
//     }

//     this.handleInputChange = this.handleInputChange.bind(this)
//     this.handleSubmit = this.handleSubmit.bind(this)
//   }

//   handleInputChange = (input: any) => {
//     this.setState({to: input})
//   }


//   handleSubmit = async () => {
//     this.setState({modalVisible: !this.state.modalVisible})

//     console.log("Update")

//     var sendData = {
//       "coordinates": {
//         "latitude": await getValue('latitude'),
//         "longitude": await getValue('longitude')
//       },
//       "start_room_name": "user",
//       "end_room_name": this.state.to
//     }

//     const response = await axios.post(API_URL_UPLOAD, sendData);

//     this.setState({to: ""})
//   }


//   render(): React.ReactNode {
//     return (
//       <View style={styles.centeredView}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={this.state.modalVisible}
//         onRequestClose={() => {
//           Alert.alert('Modal has been closed.');
//           this.setState({modalVisible: !this.state.modalVisible});
//         }}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <TextInput style={styles.modalInput}
//                       placeholderTextColor="#2F4F4F" 
//                       placeholder='Куда?'
//                       onChangeText={this.handleInputChange}
//                       value={this.state.to} />
//             <Pressable
//               style={[styles.button, styles.buttonClose]}
//               onPress={this.handleSubmit}>
//               <Text style={styles.textStyle}>Contunue </Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//       <Image
//           style={styles.image}
//           src={this.state.photo}
//       />
  
//       <Pressable
//         style={[styles.button, styles.buttonOpen]}
//         onPress={() => this.setState({modalVisible: true})}>
//         <Text style={styles.buttonText}>Открыть меню</Text>
//       </Pressable>
//     </View>
//     )
//   }


const Indoor = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [to, setTo] = useState('');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const fetchImage = async (): Promise<void> => {
      try {
        const timestamp = Date.now();
        const response = await fetch(
          `http://192.168.0.28:5000/photo1?t=${timestamp}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setImageUri(response.url);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      }
    };

    // Первый запрос сразу при монтировании
    fetchImage();
    
    // Устанавливаем интервал для повторных запросов
    intervalId = setInterval(fetchImage, 1000);

    // Очистка интервала при размонтировании компонента
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const imageSource: ImageSourcePropType | undefined = imageUri 
    ? { uri: imageUri }
    : undefined;

  const handleInputChange = (input: any) => {
    setTo(input);
  }

  const handleSubmit = async () => {
    setModalVisible(!modalVisible)

    var sendData = {
      "coordinates": {
        "latitude": await getValue('latitude'),
        "longitude": await getValue('longitude')
      },
      "start_room_name": "user",
      "end_room_name": to
    }

    const response = await axios.post(API_URL_UPLOAD, sendData);

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
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleSubmit}>
              <Text style={styles.textStyle}>Contunue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {error ? (
        <Text>Ошибка: {error}</Text>
      ) : imageSource ? (
        <Image
          source={imageSource}
          style={styles.image}
        />
      ) : (
        <Text>Загрузка первого изображения...</Text>
      )}
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
