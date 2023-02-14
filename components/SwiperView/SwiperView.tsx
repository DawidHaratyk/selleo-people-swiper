import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import people from "../../mocks/people";
import Card from "../Card/Card";

const SwiperView = () => {
  // const peoplee = people.map((person) => <Card {...person} />);

  return (
    <View style={styles.container}>
      <Card image={people[0].image} name={people[0].name} />
    </View>
  );
};

export default SwiperView;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
