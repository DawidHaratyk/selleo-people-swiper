import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import peopleList from "../../mocks/people";
import Card from "../Card/Card";

const SwiperView = () => {
  const [people, setPeople] = useState(peopleList);

  const handleRemovePerson = (id: number) => {
    const timeout = setTimeout(() => {
      setPeople((prevState) => prevState.filter((person) => person.id !== id));
    }, 100);

    return () => clearTimeout(timeout);
  };

  return (
    <View style={styles.container}>
      <Card
        handleRemovePerson={handleRemovePerson}
        person={people[0]}
        key={people[0].id}
      />
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
