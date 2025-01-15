import { Link } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('@/assets/images/logo.png')}
      />
      <Text style={styles.title}>Lodestar</Text>
      <View style={styles.buttonContainer}>
      <Link  href="/indoor" >
        <View style={styles.button}>
          <Image
            style={styles.buttonImageI} 
            source={require('@/assets/images/Indoor.png')}
          />
        </View>
      </Link>
        <Link  href="/maps" >
          <View style={styles.button}>
            <Image
              style={styles.buttonImageI}
              source={require('@/assets/images/Maps.png')}
            />
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111317',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260,
  },
  button: {
    width: 115,
    height: 115,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
  },
  buttonImage: {
    width: 60,
    height: 60,
  },
  buttonImageI: {
    width: 110,
    height: 110,
  },
});
