import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

const GOOGLE_MAPS_APIKEY = "your_google_maps_api_key";

const Points = () => {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [destinationType, setDestinationType] = useState(
    "Recycling Facilities"
  );
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const recyclingFacilities = [
    {
      facility_id: "60f4a1bd0d1a2b3414b9c7f3",
      name: "Green Recycle Center",
      address: "456 Elm St",
      coordinates: [90.123456, 23.456789],
    },
    {
      facility_id: "60f4a1bd0d1a2b3414b9c7f4",
      name: "Eco-Friendly Recycling Hub",
      address: "789 Maple St",
      coordinates: [90.987654, 23.654321],
    },
  ];

  const dropOffPoints = [
    {
      point_id: "60f4a1bd0d1a2b3414b9c7f5",
      name: "East Drop-off Point",
      address: "123 Oak St",
      coordinates: [90.765432, 23.876543],
    },
    {
      point_id: "60f4a1bd0d1a2b3414b9c7f6",
      name: "West Drop-off Point",
      address: "321 Pine St",
      coordinates: [90.54321, 23.987654],
    },
  ];

  const wasteManagementCenters = [
    {
      center_id: "60f4a1bd0d1a2b3414b9c7f7",
      name: "Main Waste Management Center",
      address: "456 Birch St",
      coordinates: [90.654321, 23.123456],
    },
    {
      center_id: "60f4a1bd0d1a2b3414b9c7f8",
      name: "South Waste Management Facility",
      address: "789 Cedar St",
      coordinates: [90.432109, 23.987654],
    },
  ];

  const markers = {
    "Recycling Facilities": recyclingFacilities.map((facility) => ({
      id: facility.facility_id,
      title: facility.name,
      description: facility.address,
      coordinates: {
        latitude: facility.coordinates[1],
        longitude: facility.coordinates[0],
      },
    })),
    "Drop-off Points": dropOffPoints.map((point) => ({
      id: point.point_id,
      title: point.name,
      description: point.address,
      coordinates: {
        latitude: point.coordinates[1],
        longitude: point.coordinates[0],
      },
    })),
    "Waste Management Centers": wasteManagementCenters.map((center) => ({
      id: center.center_id,
      title: center.name,
      description: center.address,
      coordinates: {
        latitude: center.coordinates[1],
        longitude: center.coordinates[0],
      },
    })),
  };

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Allow location access to use this feature."
      );
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  useEffect(() => {
    fetchLocation().then(() => setLoading(false));
  }, []);

  const renderMarkerColor = (type) => {
    switch (type) {
      case "Recycling Facilities":
        return "green";
      case "Drop-off Points":
        return "blue";
      case "Waste Management Centers":
        return "orange";
      default:
        return "gray";
    }
  };

  const handleMarkerPress = (marker) => {
    setSelectedDestination(marker.coordinates);
  };

  const dropdownItems = [
    { label: "Recycling Facilities", value: "Recycling Facilities" },
    { label: "Drop-off Points", value: "Drop-off Points" },
    { label: "Waste Management Centers", value: "Waste Management Centers" },
  ];

  const renderDropdownItem = ({ item }) => (
    <TouchableOpacity
      className="p-4 bg-primary rounded-lg mb-2"
      onPress={() => {
        setDestinationType(item.value);
        setDropdownVisible(false);
      }}
    >
      <Text className="text-white text-center">{item.label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-primary h-full flex items-center justify-center">
        <ActivityIndicator size="large" color="#FFA001" />
        <Text className="text-lg text-white mt-4">Loading Map Data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full p-4">
      <View className="mb-4 bg-white rounded-lg p-3 shadow-lg">
        <Text className="text-lg font-bold mb-2">Select Location Type</Text>
        <TouchableOpacity
          className="flex flex-row justify-between items-center bg-gray-100 rounded-lg p-2"
          onPress={() => setDropdownVisible(true)}
        >
          <Text className="text-lg">{destinationType}</Text>
        </TouchableOpacity>
      </View>
      <MapView
        className="flex-1"
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          pinColor="red"
        />
        {markers[destinationType].map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinates}
            title={marker.title}
            description={marker.description}
            pinColor={renderMarkerColor(destinationType)}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
        {selectedDestination && (
          <MapViewDirections
            origin={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            destination={selectedDestination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="blue"
          />
        )}
      </MapView>
      <Modal
        visible={dropdownVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <SafeAreaView className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
          <View className="bg-white rounded-lg w-full p-6">
            <Text className="text-2xl font-bold mb-4 text-center">
              Select Location Type
            </Text>
            <FlatList
              data={dropdownItems}
              renderItem={renderDropdownItem}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              className="p-4 bg-gray-400 rounded-lg mt-4"
              onPress={() => setDropdownVisible(false)}
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Points;
