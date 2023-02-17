import { StyleSheet, View, Image, Text } from "react-native";
import React from "react";
import { Person } from "../../types";
import { generateTwoPeople } from "./utils/utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  handleRemovePerson: (id: number) => void;
  person: Person;
};

const Card = ({ handleRemovePerson, person }: Props) => {
  console.log(person);
  const twoPeople = generateTwoPeople(person);

  const END_POSITION = 400;
  const onLeft = useSharedValue(true);
  const position = useSharedValue({ x: 0, y: 0 });
  const rotation = useSharedValue({ x: 0, y: 0 });
  const savedRotation = useSharedValue({ x: 0, y: 0 });

  const rotationGesture = Gesture.Rotation()
    .onBegin((e) => {
      console.log(e.state);
      rotation.value = {
        x: savedRotation.value.x + e.anchorX,
        y: savedRotation.value.y + e.anchorY,
      };
    })
    .onEnd((e) => {
      console.log(e.rotation);
      savedRotation.value = {
        x: 0,
        y: 0,
      };
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (onLeft.value) {
        position.value = {
          x: e.translationX,
          y: e.translationY,
        };
      } else {
        position.value = {
          x: END_POSITION + e.translationX,
          y: e.translationY,
        };
      }
    })
    .onEnd((e) => {
      if (position.value.x > 40 || position.value.x < -40) {
        position.value = {
          x: withTiming(position.value.x > 0 ? END_POSITION : -END_POSITION, {
            duration: 100,
          }),
          y: withTiming(0, { duration: 100 }),
        };
        onLeft.value = false;
        handleRemovePerson(person.id);
      } else {
        position.value = {
          x: withTiming(0, { duration: 100 }),
          y: withTiming(0, { duration: 100 }),
        };
        onLeft.value = true;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value.x },
      { translateY: position.value.y },
    ],
  }));

  const rotationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${(rotation.value.x / Math.PI) * 180}deg` }],
  }));

  const composedGestures = Gesture.Race(panGesture, rotationGesture);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGestures}>
        <Animated.View
          style={[styles.card, animatedStyle, rotationAnimatedStyle]}
        >
          <Text style={[styles.name, styles.firstName]}>
            {twoPeople[0].name}
          </Text>
          <Text style={[styles.name, styles.secondName]}>
            {twoPeople[1].name}
          </Text>
          <Image source={person.image} style={styles.image} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: "100%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    position: "absolute",
    top: 10,
    padding: 10,
    backgroundColor: "gray",
  },
  firstName: {
    top: 10,
    left: 10,
  },
  secondName: {
    top: 10,
    right: 10,
  },
  leftNameContainer: {
    width: "100%",
    height: "100%",
  },
  rightNameContainer: {
    alignItems: "flex-end",
    width: "100%",
    height: "100%",
  },
  container: {
    position: "absolute",
    top: "12%",
    left: "8%",
    width: "84%",
    height: "76%",
  },
});
