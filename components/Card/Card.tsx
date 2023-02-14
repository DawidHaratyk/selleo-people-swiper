import { StyleSheet, View, Text, Image } from "react-native";
import React from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";

type Props = {
  name: string;
  image: string;
};

const Card = ({ name, image }: Props) => {
  const leftSwipe = () => (
    <View style={styles.deleteBtn}>
      <Text>Delete</Text>
    </View>
  );

  return (
    <Swipeable
      renderLeftActions={leftSwipe}
      containerStyle={styles.card}
      // renderRightActions={rightSwipeActions}
      // onSwipeableRightOpen={swipeFromRightOpen}
      // onSwipeableLeftOpen={swipeFromLeftOpen}
    >
      <Image source={image} style={styles.image} />
      <Text>{name}</Text>
    </Swipeable>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: "85%",
    height: "75%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  deleteBtn: {
    backgroundColor: "red",
  },
});
