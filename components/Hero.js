"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();
  return (
    // i want to design a website in which two players physically pick playing cards one by one and cards flips and show their number and the number adds to player's score and after card is picked it removes from the screen and at last when all cards are picked higher score player wins. with a better ui and background. this is a home page hero section with a background image of playing cards and button for play now and title of the website and some description and some more exciting content and styling to look like a gamified experience and attractive to users.
    <div className='relative w-screen min-h-screen bg-[url("/images/table2.jpg")] bg-cover flex justify-center items-center text-4xl font-bold text-white p-12'>
      <video
        src="/images/bg2.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      ></video>
      <div className="bg-white/10 backdrop-blur-sm border-white/10 p-10 rounded-lg text-center max-w-2xl mt-20">
        <h1 className="text-4xl md:text-6xl mb-4">Welcome to FlipCards</h1>
        <p className="md:text-2xl text-xl mb-8">
          Flip cards. Score points. Defeat your opponent.
        </p>
        <p className="md:text-2xl text-xl mb-8">
          A fast-paced two-player card game where every flip matters. Take
          turns, reveal numbers, build your score, and claim victory when the
          deck runs out.
        </p>
        <button
          onClick={() => router.push("/game")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full text-2xl duration-500 transform hover:scale-105"
        >
          Play Now
        </button>
      </div>
    </div>
  );
};

export default Hero;
