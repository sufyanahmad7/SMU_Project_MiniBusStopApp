// import { StatusBar } from 'expo-status-bar';
// import React from 'react';
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=85019"
const BUS = 10;

export default function App() 
{
  const [loading, setLoading] = useState(true);
  const [arrival, setArrival] = useState("");
  const [duration, setDuration] = useState("");
  const [subTime, setSubTime] = useState("");

  function dateConvert(time)
  {
    const day = new Date(time)

    // The toLocaleTimeString() method returns a string with a language sensitive representation of the time portion of this date. The new locales and options arguments let applications specify the language whose formatting conventions should be used and customize the behavior of the function.
    let [hour, minute, second] = day.toLocaleTimeString("en-US").split(":")
    const timeArranged = `${hour}:${minute}.${second}`
    
    return timeArranged
  }

  function loadBusStopData()
  {
    setLoading(true);
    
    fetch(BUSSTOP_URL)
    .then((response) => response.json())
    .then((responseData) =>
    {
      // Retrieve data from source and display.
      console.log("Original data:");
      
      // Filter by bus number.
      const myBus = responseData.services.filter
      (
        (item) => item.no == BUS
      )
      [0]; // Retrieves object [0] of the array.
      
      // For next bus
      setArrival(dateConvert(myBus.next.time));
      // For waiting time
      setDuration(Math.round((myBus.next.duration_ms)/60000))
      // For subsequent bus time
      setSubTime(dateConvert(myBus.subsequent.time))
      
      setLoading(false);
      
      console.log("My bus is:");
      console.log(myBus);
    })
  }

  useEffect(() => 
  {
    loadBusStopData();
    const interval = setInterval(loadBusStopData, 15000);

    return () => clearInterval(interval);
  }, []);

  return (

    <View style={styles.container}>
      <Text style={styles.title}>Bus Arrival Timings</Text>
      <Text style={styles.arrivalTime}>
        {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Text>The next bus is at {arrival}</Text>}
      </Text>
      <Text style={styles.arrivalTime}>
        {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Text>Waiting time is {duration} mins</Text>}
      </Text>
      <Text style={styles.arrivalTime}>
        {loading ? <ActivityIndicator size="large" color="#0000ff" /> : <Text>The next next bus is at {subTime}</Text>}
      </Text>
      
      <TouchableOpacity onPress={loadBusStopData} style={styles.button}><Text>Refresh</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title:
  {
    fontSize: 30,
    marginBottom: 20,
  },

  button:
  {
    backgroundColor: "lightblue",
    width: 100,
    height: 40,
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
});
