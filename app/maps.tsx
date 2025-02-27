import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Button, StyleSheet, Alert, NativeSyntheticEvent } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Region } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "polyline";
import * as SecureStore from 'expo-secure-store';
import { LatLng, Point } from 'react-native-maps';
import { Link, Redirect, useRouter } from 'expo-router';

type Marker = {
  coordinate: LatLng,
  oint: Point
}

const saveValue = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value)
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search?format=json&q=";
const ROUTING_URL = "https://router.project-osrm.org/route/v1/driving/";
const USER_AGENT = "YourApp/1.0 (your@email.com)"; // Добавляем User-Agent

const App: React.FC = () => {
  const router = useRouter(); 
  const [region, setRegion] = useState<Region | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState("");
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const mapRef = useRef<MapView | null>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Ошибка", "Разрешение на доступ к местоположению отклонено");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      startTracking();
    })();
  }, []);

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

  const startTracking = async () => {
    locationSubscription.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
      (newLocation) => {
        setLocation(newLocation);
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    );
  };

  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const focusOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const searchAddress = async () => {
    if (!address) return;
    try {
      const response = await fetch(`${NOMINATIM_URL}${encodeURIComponent(address)}`, {
        headers: { "User-Agent": USER_AGENT },
      });
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
        if (location) {
          getRoute(location.coords.latitude, location.coords.longitude, parseFloat(lat), parseFloat(lon));
        }
      } else {
        Alert.alert("Ошибка", "Адрес не найден");
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось выполнить запрос");
    }
  };

  const getRoute = async (startLat: number, startLon: number, endLat: number, endLon: number) => {
    try {
      const response = await fetch(`${ROUTING_URL}${startLon},${startLat};${endLon},${endLat}?geometries=polyline`);
      const data = await response.json();
      if (data.routes.length > 0) {
        const decodedCoords = polyline.decode(data.routes[0].geometry).map(([lat, lon]: number[]) => ({ latitude: lat, longitude: lon }));
        setRouteCoords(decodedCoords);
      }
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось построить маршрут");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        onPress={redirectIndoor}
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region || undefined}
      >
        {location && <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} title="Вы здесь" />}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />}
      </MapView>
      <View style={styles.controls}>
        <TextInput style={styles.input} placeholder="Введите адрес" value={address} onChangeText={setAddress} />
        <Button title="Найти" onPress={searchAddress} />
        <Button title="Мое местоположение" onPress={focusOnUser} />
      </View>
      <View style={styles.linkContainer} >
        <Link style={{ color: '#fff', fontSize: 20, marginBottom: 15 }} href='/'>Back</Link>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  controls: { position: "absolute", top: 40, left: 10, right: 10, backgroundColor: "#201E28", padding: 10, borderRadius: 10 },
  input: { height: 40, borderColor: "#E2A600",borderRadius: 10, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, color: "white" },
  linkContainer: {
    // flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center', 
    alignItems: 'center',
    height: 50,
  },
});

export default App;