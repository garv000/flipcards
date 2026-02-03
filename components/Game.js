"use client";
import React, { useState, useEffect, use } from "react";
import { generateDeck } from "../utils/deck";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import confetti from "canvas-confetti";

const suitSymbols = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

const Game = () => {
  const [cards, setCards] = useState([]);
  const [scores, setScores] = useState({ Player1: 0, Player2: 0 });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [winner, setWinner] = useState(null);

  const [flippedCardId, setFlippedCardId] = useState(null);
  const [pickedCards, setPickedCards] = useState(new Set());
  const [isLocked, setIsLocked] = useState(false);
  const [isDealing, setIsDealing] = useState(true);

  // client-only deck generation (hydration safe)
  useEffect(() => {
    setCards(generateDeck());
  }, []);

  useEffect(() => {
    if (!winner) return;

    const tl = gsap.timeline();

    tl.from(".win-box", {
      scale: 0,
      duration: 0.6,
      ease: "back.out(1.8)",
    }).from(
      ".win-text",
      {
        y: 40,
        opacity: 0,
        duration: 0.4,
      },
      "-=0.3",
    );

    confetti({
      particleCount: 180,
      spread: 90,
      origin: { y: 0.6 },
    });
  }, [winner]);

  useGSAP(() => {
    if (!cards.length) return;

    setIsDealing(true);

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => setIsDealing(false),
    });

    const deck = gsap.utils.toArray(".card");

    // 1️⃣ Stack all cards at viewport center (DECK)
    tl.set(deck, {
      position: "fixed",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 0.9,
      rotation: 0,
      opacity: 1,
    });

    // 2️⃣ REALISTIC SHUFFLE (riffle-style motion)
    tl.to(deck, {
      x: () => gsap.utils.random(-20, 20),
      y: () => gsap.utils.random(-15, 15),
      rotation: () => gsap.utils.random(-15, 15),
      duration: 0.15,
      stagger: {
        each: 0.015,
        from: "random",
      },
      repeat: 3,
      yoyo: true,
    });

    // 3️⃣ DEAL CARDS ONE BY ONE TO TABLE
    tl.to(deck, {
      clearProps: "position,top,left,xPercent,yPercent",
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.5,
      stagger: {
        each: 0.05, // deal speed
        from: "start",
      },
    });
  }, [cards]);

  const handleCardPick = (card) => {
    if (isLocked || isDealing || pickedCards.has(card.id)) return;

    setIsLocked(true);
    setFlippedCardId(card.id);

    setTimeout(() => {
      setPickedCards((prev) => {
        const next = new Set(prev);
        next.add(card.id);
        return next;
      });

      setScores((prev) => {
        const updated = {
          ...prev,
          [currentPlayer === 1 ? "Player1" : "Player2"]:
            prev[currentPlayer === 1 ? "Player1" : "Player2"] + card.value,
        };

        if (pickedCards.size + 1 === cards.length) {
          setWinner(updated.Player1 > updated.Player2 ? 1 : 2);
        }

        return updated;
      });

      setCurrentPlayer((p) => (p === 1 ? 2 : 1));
      setFlippedCardId(null);
      setIsLocked(false);
    }, 700);
  };

  return (
    <div className='relative min-h-screen w-screen bg-[url("/images/table2.jpg")] bg-cover text-white overflow-x-hidden'>
      {/* BACKGROUND OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />

      {/* SCOREBOARD HUD */}
      <div className="fixed z-40 top-16 w-full">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          {/* PLAYER 1 */}
          <div
            className={`relative flex w-32 sm:w-52 flex-col items-center rounded-2xl
            bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3
            transition-all duration-300
            ${
              currentPlayer === 1
                ? "ring-2 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.9)] scale-105"
                : "opacity-100"
            }`}
          >
            <span className="text-xs tracking-widest text-white/60">
              PLAYER 1
            </span>
            <span className="text-3xl font-extrabold">{scores.Player1}</span>
          </div>

          {/* TURN */}
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-white/50">
              Turn
            </span>
            <span className="mt-1 rounded-full backdrop-blur-sm bg-green-500/20 px-4 py-1 text-sm      font-semibold text-green-300 animate-pulse">
              Player {currentPlayer}
            </span>
          </div>

          {/* PLAYER 2 */}
          <div
            className={`relative flex w-32 sm:w-52 flex-col items-center rounded-2xl
            bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3
            transition-all duration-300
            ${
              currentPlayer === 2
                ? "ring-2 ring-green-400 shadow-[0_0_30px_rgba(74,222,128,0.9)] scale-105"
                : "opacity-100"
            }`}
          >
            <span className="text-xs tracking-widest text-white/60">
              PLAYER 2
            </span>
            <span className="text-3xl font-extrabold">{scores.Player2}</span>
          </div>
        </div>
      </div>

      {/* GAME BOARD */}
      <div className="board relative z-2 mx-auto flex max-w-6xl flex-wrap justify-center gap-4 mt-24 py-20 px-4">
        {cards.map((card) => {
          const isFlipped =
            flippedCardId === card.id || pickedCards.has(card.id);
          const isPicked = pickedCards.has(card.id);

          return (
            <div
              key={card.id}
              onClick={() => !isPicked && !isLocked && handleCardPick(card)}
              className={`card h-28 w-20 perspective transition-all duration-500
                ${
                  isPicked
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:scale-110 hover:-translate-y-1 hover:rotate-1"
                }`}
            >
              <div
                className={`relative h-full w-full duration-700 transform-3d
                  ${isFlipped ? "rotate-y-180" : ""}`}
              >
                {/* CARD BACK */}
                <div className="absolute inset-0 backface-hidden rounded-lg bg-[url('/images/cardback.jpg')] bg-cover shadow-lg" />

                {/* CARD FRONT */}
                <div
                  className={`absolute inset-0 rotate-y-180 backface-hidden rounded-lg
                  bg-linear-to-br from-white to-gray-100 border border-black/20 shadow-md
                  ${card.color === "red" ? "text-red-600" : "text-black"}`}
                >
                  {/* top-left */}
                  <div className="absolute top-2 left-2 flex flex-col items-center leading-none">
                    <span className="text-sm font-bold">{card.rank}</span>
                    <span className="text-sm">{suitSymbols[card.suit]}</span>
                  </div>

                  {/* center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl md:text-5xl">
                      {suitSymbols[card.suit]}
                    </span>
                  </div>

                  {/* bottom-right */}
                  <div className="absolute bottom-2 right-2 flex flex-col items-center leading-none rotate-180">
                    <span className="text-sm font-bold">{card.rank}</span>
                    <span className="text-sm">{suitSymbols[card.suit]}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WINNER MODAL */}
      {winner && (
        <div
          id="win-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <div className="win-box rounded-3xl bg-white/10 backdrop-blur-sm p-10 text-center">
            <h1 className="win-text text-5xl font-extrabold bg-linear-to-r from-green-300 to-emerald-500 bg-clip-text text-transparent mb-4">
              Player {winner} Wins!
            </h1>
            <p className="text-white/70 mb-6">
              Incredible play. Ready for a rematch?
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-green-500 px-10 py-3 font-bold text-black hover:scale-105 transition"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
