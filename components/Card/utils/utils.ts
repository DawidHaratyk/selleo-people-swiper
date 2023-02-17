import people from "../../../mocks/people";
import { Person } from "../../../types";

export const generateRandomPerson = (cannotBeId: number) => {
  const newPeople = people.filter((person) => person.id !== cannotBeId);
  const randomIndex = Math.floor(Math.random() * newPeople.length);

  return newPeople[randomIndex];
};

export const generateTwoPeople = (person: Person) => {
  const peopleCount = 2;
  const displayedPersonIndex = Math.floor(Math.random() * 2);

  const randomPerson = generateRandomPerson(person.id);

  const twoPeople = Array.from({ length: peopleCount }, (_, index) => {
    if (index === displayedPersonIndex) {
      return person;
    } else return randomPerson;
  });

  return twoPeople;
};
