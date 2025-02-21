import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, TextInput, Button, Image, TouchableOpacity, ImageSourcePropType, ImageBackground } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import FastImage from 'react-native-fast-image';

// const API_URL_UPLOAD = "http://92.255.111.193:5000/upload"
const API_URL_UPLOAD = "http://192.168.0.28:5000/upload";

const getValue = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

const Indoor = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [to, setTo] = useState('');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("http://192.168.0.28:5000/photo1");

  const [level, setLevel] = useState<boolean>();
  const [number, setNumber] = useState<number>(1);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchImage = async (): Promise<void> => {
      try {
        const timestamp = Date.now();
        const response = await fetch(`${url}?t=${timestamp}`);

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
    intervalId = setInterval(fetchImage, 2000);

    // Очистка интервала при размонтировании компонента
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [url]); // Зависимость от url, чтобы эффект перезапускался при изменении url

  const imageSource: ImageSourcePropType | undefined = imageUri
    ? { uri: imageUri }
    : undefined;

  const handleInputChange = (input: any) => {
    setTo(input);
  };

  const handleSubmit = async () => {
    setModalVisible(!modalVisible);

    var sendData = {
      "coordinates": {
        "latitude": await getValue('latitude'),
        "longitude": await getValue('longitude')
      },
      "start_room_name": "user",
      "end_room_name": to
    };

    const response = await axios.post(API_URL_UPLOAD, sendData);

    if (response.data.message[0] == response.data.message[1]) {
      setLevel(false);
    } else {
      setLevel(true);
    }

    setTo("");
  };

  // Функция для изменения URL
  const changeUrl = () => {
    const newNumber = number === 1 ? 2 : 1; // Переключаем между 1 и 2
    setNumber(newNumber);
    setUrl(`http://192.168.0.28:5000/photo${newNumber}`); // Обновляем URL
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
              <Text style={styles.textStyle}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {error ? (
        <Text>Ошибка: {error}</Text>
      ) : imageSource ? (
        <Image
          source={imageSource}
          key={imageUri}
          style={styles.image}
        />
      ) : (
        <Text>Загрузка первого изображения...</Text>
      )}

      {/* Новая кнопка для изменения URL */}
      {
        level ? <Pressable
          style={[styles.button, styles.buttonChangeUrl]}
          onPress={changeUrl}>
          <Text style={styles.buttonText}>Сменить фото</Text>
        </Pressable> : <></>
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
  buttonChangeUrl: {
    backgroundColor: '#4CAF50', // Зеленый цвет для новой кнопки
    marginTop: 10, // Отступ сверху
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
