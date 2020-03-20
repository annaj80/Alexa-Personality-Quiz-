'use strict';
const Alexa = require('ask-sdk');
const Util = require('./util.js');


const SKILL_NAME = "Personality Quiz";
const HELP_MESSAGE_BEFORE_START = "I will ask you several questions. Answer with yes or no and I will work my magic to discern your spirit animal. Are you ready to get started?";
const HELP_MESSAGE_AFTER_START = "You can say yes no to answer each question. I will then analyze the results and tell you your spirit animal.";
const HELP_REPROMPT = "Answer all of my questions by replying with yes or no and I will tell you your spirit animal.";
const STOP_MESSAGE = "Come back soon, your spirit animal will be here for all eternity.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "You can answer by saying yes or no.";

//const BACKGROUND_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/default.jpg";//
const BACKGROUND_IMAGE_URL =  "logopic.jpg";
const BACKGROUND_GOODBYE_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/goodbye.jpg";
//const BACKGROUND_GOODBYE_IMAGE_URL = "logopic.jpg";//
//const BACKGROUND_HELP_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/help.jpg";//
const BACKGROUND_HELP_IMAGE_URL = "logopic.jpg";
const WELCOME_MESSAGE = "Welcome! I will use my powers to discern what animal most represents the very essence of your spirit. All you have to do is answer five questions with either yes or no. Are you ready to get started?";
const INITIAL_QUESTION_INTROS = [
  "Really?! Ok, Let's get started!",
  "<say-as interpret-as='interjection'>Magnificent! </say-as>Here we go! Question number one!",
  "Spirit animal, here you come. <say-as interpret-as='interjection'> Bam!</say-as>.",
  "<say-as interpret-as='interjection'>Er, ok. </say-as>Time to change your life!"
];
const QUESTION_INTROS = [
  "Next!",
  "Okay",
  "This answer will reveal all!",
  "How do I say this?",
  "This should be telling.",
  "The spirit zoo is finally opening it's gates.",
];
const UNDECISIVE_RESPONSES = [
  "<say-as interpret-as='interjection'>ding ding ding!</say-as> Too slow, I picked for you.",
  "<say-as interpret-as='interjection'>tick-tock!</say-as> And time's up.",
  "<say-as interpret-as='interjection'>No way!</say-as> No answer? Hmm, I'll take a guess.",
  "<say-as interpret-as='interjection'>Eh?</say-as> Well, we have to keep moving, the spirit animals are waiting.",
  "<say-as interpret-as='interjection'>dun dun dun</say-as> It's ok, I know you better than you know yourself.",
];
const RESULT_MESSAGE = "The time has come! The planets have aligned and your spirit animal is "; // the name of the result is inserted here.
const RESULT_MESSAGE_SHORT = "Your spirit animal is"; // the name of the result is inserted here.
const PLAY_AGAIN_REQUEST = "The heavens have spoken. Do you want to play again?";

const resultList = {
  result1: {
    name: "an African Elephant",
    display_name: "African Elephant",
    audio_message: "African Elephants are emotional animals, known for their amazing memories.",
    description: "Your memory is so sharp, your friends ask you to remind them of things to have someone to blame when they forget. You are a kind soul and gentle very gentle. You may be afraid of mice and enjoy eating peanuts in your nose.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Red-knobbed.starfish.1200.jpg"//
      largeImageUrl: "elephant.jpg",
    }
  },
  result2: {
    name: "a Tropical Toucan",
    display_name: "Tropical Toucan",
    audio_message: "Tropical toucans are known for their beautiful colorful feathers.",
    description: "Your friends would describe you as having a colorful personality, whatever that means. You're likely to be vegetarian, feasting on fruits and seeds and meat when no one is looking. When you're in one place too long you like to spread your wings and skip town for a long weekend.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Aceria_anthocoptes.1200.jpg"//
      largeImageUrl: "toucan.jpg",
    }
  },
  result3: {
    name: "a Polar Bear",
    display_name: "Polar Bear",
    audio_message: "Polar bears are strong majestic animals and surprisingly strong swimmers.",
    description: "Your friends know you by your hairy palms and the way you easily blend into the background. You're likely to enjoy swimming in frigid waters. You prefer your steaks exotic and extra rare.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Anodorhynchus_hyacinthinus.1200.jpg"//
      largeImageUrl: "polar bear.jpg",
    }
  },
  result4: {
    name: "a Siberian Tiger",
    display_name: "Siberian Tiger",
    audio_message: "The Siberian Tiger is the largest and strongest feline in all of the world.",
    description: "You adapt easily to your environment, but if not, you make sure your environment adapts to you. You are likely to value profits over people. Since others fear you, you enjoy a solitary lifestyle.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Male_goat.1200.jpg"//
      largeImageUrl: "siberian tiger.jpg",
    }
  },
  result5: {
    name: "an Atlantic Octopus",
    display_name: "Atlantic Octopus",
    audio_message: "The Atlantic octopus is a clever adaptive creature. They are known for causing mischief and having distinct individual personalities.",
    description: "You catch on quickly to new concepts and ideas. Your friends would say you have a gift for squeezing your way out of tight situations. You may have difficulty knowing when a relationship or hug, is over.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Bufo_boreas.1200.jpg"//
      largeImageUrl: "octopus.jpg",
    }
  }
};

const questions = [{
    question: "Do you like to control others?",
    questionDisplay: "Do you like to control others?",
    //background:  "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q1.jpg",//
    background: "controlling.jpg",
    points: {
      result1: 3,
      result2: 2,
      result3: 1,
      result4: 5,
      result5: 4
    }
  },
  {
    question: "Do you eat meat?",
    questionDisplay: "Do you eat meat?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q2.jpg",//
    background: "meat.jpg",
    points: {
      result1: 2,
      result2: 1,
      result3: 5,
      result4: 4,
      result5: 1
    }
  },
  {
    question: "Do you like to travel?",
    questionDisplay: "Do you like to travel?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q3.jpg",//
    background: "travel.jpg",
    points: {
      result1: 2,
      result2: 5,
      result3: 0,
      result4: 4,
      result5: 1
    }
  },
  {
    question: "Do you have a good memory?",
    questionDisplay: "Do you have a good memory?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q4.jpg",//
    background: "memory.jpg",
    points: {
      result1: 5,
      result2: 2,
      result3: 1,
      result4: 3,
      result5: 4
    }
  },
  {
    question: "Have you been described as clingy?",
    questionDisplay: "Have you been described as clingy?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q5.jpg",//
    background: "clingy.jpg",
    points: {
      result1: 2,
      result2: 1,
      result3: 4,
      result4: 0,
      result5: 5
    }
  }
];
