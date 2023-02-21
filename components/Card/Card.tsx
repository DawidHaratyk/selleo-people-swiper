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

  const END_POSITION = 400;
  const position = useSharedValue({
    x: 0,
    y: 0,
    currentHoldY: 0,
  });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      position.value = {
        x: e.translationX,
        y: e.translationY,
        currentHoldY: e.y,
      };
    })
    .onEnd((e) => {
      const swipeDirection = e.translationX > 0 ? "right" : "left";
      const boundary = 40;
      const translateX = position.value.x;

      if (translateX > boundary || translateX < -boundary) {
        position.value = {
          x: withTiming(
            translateX > 0 ? END_POSITION : -END_POSITION,
            {
              duration: 1000,
              easing: Easing.out(Easing.exp),
            },
            () => {
              const shouldAddPoint =
                swipeDirection === displayedPersonSwipeDirection;

              runOnJS(onSwipe)(person.id, shouldAddPoint);
            }
          ),
          y: withTiming(0, { duration: 1000, easing: Easing.out(Easing.exp) }),
          currentHoldY: withTiming(0, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
          }),
        };
      } else {
        position.value = {
          x: withTiming(0, { duration: 100 }),
          y: withTiming(0, { duration: 100 }),
          currentHoldY: withTiming(0, { duration: 100 }),
        };
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      position.value.x,
      [-END_POSITION, 0, END_POSITION],
      [-30, 0, 30],
      {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.IDENTITY,
      }
    );

    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y },
        {
          rotate:
            position.value.currentHoldY > 330
              ? `${-rotate}deg`
              : `${rotate}deg`,
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
    minWidth: 300,
    width: 350,
    maxWidth: "94%",
    height: 660,
    maxHeight: 720,
  },
  // container: {
  //   position: "absolute",
  //   top: "12%",
  //   left: "8%",
  //   right: "8%",
  //   minWidth: 300,
  //   width: 350,
  //   maxWidth: "92%",
  //   height: 660,
  //   maxHeight: 720,
  // },
});
