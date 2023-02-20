import { StyleSheet, View, Text } from "react-native";
import React, { useState } from "react";
import peopleList from "../../mocks/people";
import Card from "../Card/Card";

const SwiperView = () => {
  const [people, setPeople] = useState(peopleList);
  const [result, setResult] = useState(0);

  const handleRemovePerson = (id: number) => {
    const timeout = setTimeout(() => {
      setPeople((prevState) => prevState.filter((person) => person.id !== id));
    }, 100);

    return () => clearTimeout(timeout);
  };

  const addPoint = () => {
    setResult((prevState) => prevState + 1);
  };

  return (
    <View style={styles.container}>
      {people.length ? (
        <Card
          handleRemovePerson={handleRemovePerson}
          person={people[0]}
          addPoint={addPoint}
          key={people[0].id}
        />
      ) : (
        <Text>Your result is {result}</Text>
      )}
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
