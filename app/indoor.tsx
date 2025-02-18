import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image, TouchableOpacity, ImageSourcePropType} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'

// const API_URL_UPLOAD = "http://92.255.111.193:5000/upload"
const API_URL_UPLOAD = "http://192.168.0.28:5000/upload"

const getValue = async (key: string) => {
  return await SecureStore.getItemAsync(key) 
}


const Indoor = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [to, setTo] = useState('');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("http://192.168.0.28:5000/photo1");

  const [level, setLevel] = useState<boolean>();
  const [number, setNumber] = useState<string>();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const fetchImage = async (): Promise<void> => {
      try {
        const timestamp = Date.now();
        const response = await fetch(
          `${url}?t=${timestamp}`
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

    if(response.data.message[0] == response.data.message[1]) {
      setLevel(false)
      setNumber("1");
    } else {
      setLevel(true)
      setNumber("2");
    }

    // console.log(response.data.message[0]);

    // setLevel([response.data.message[0], response.data.message[1]])

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

      {
        level ? <Button title='hui' onPress={() => setUrl(`http://192.168.0.28:5000/photo${number}`)} /> : <></>
      }
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
    height: '60%',
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
