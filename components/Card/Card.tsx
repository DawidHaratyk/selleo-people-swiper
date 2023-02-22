import { StyleSheet, Image, Text } from "react-native";
import React from "react";
import { Person } from "../../types";
import { generateTwoPeople } from "./utils/utils";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  BounceInUp,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  onSwipe: (id: number, shouldAddPoint: boolean) => void;
  person: Person;
};

const Card = ({ onSwipe, person }: Props) => {
  const { twoPeople, displayedPersonSwipeDirection } =
    generateTwoPeople(person);

  const END_POSITION = 600;

  const positionX = useSharedValue(0);
  const positionY = useSharedValue(0);
  const currentHoldY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      positionX.value = e.translationX;
      positionY.value = e.translationY;
      currentHoldY.value = e.y;
    })
    .onEnd((e) => {
      const swipeDirection = e.translationX > 0 ? "right" : "left";
      const boundary = 40;
      const translateX = positionX.value;

      if (translateX > boundary || translateX < -boundary) {
        positionX.value = withTiming(
          positionX.value > 0 ? END_POSITION : -END_POSITION,
          {
            duration: 1000,
            easing: Easing.out(Easing.exp),
          },
          () => {
            const shouldAddPoint =
              swipeDirection === displayedPersonSwipeDirection;

            runOnJS(onSwipe)(person.id, shouldAddPoint);
          }
        );

        positionY.value = withTiming(0, {
          duration: 1000,
          easing: Easing.out(Easing.exp),
        });
      } else {
        positionX.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.exp),
        });

        positionY.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.exp),
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      positionX.value,
      [-END_POSITION, 0, END_POSITION],
      [-30, 0, 30],
      {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.IDENTITY,
      }
    );

    return {
      transform: [
        { translateX: positionX.value },
        { translateY: positionY.value },
        {
          rotate: currentHoldY.value > 330 ? `${-rotate}deg` : `${rotate}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.card, animatedStyle]}
          entering={BounceInUp}
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
    </Animated.View>
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
    right: "8%",
    minWidth: 300,
    width: 350,
    maxWidth: "92%",
    height: 660,
    maxHeight: 720,
  },
});
