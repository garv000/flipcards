"use client";
import React, { useActionState } from 'react'
import Link from 'next/link'
import { useState } from 'react';
import Image from 'next/image';

const Navbar = () => {
    const [showRules, setShowRules] = useState(false);
    const handleClick = () => {
        if (showRules) {
            setShowRules(false);
            return;
        }
        setShowRules(true);
    }
  return (
    <nav className='top-0 left-0 fixed w-full h-16 bg-white/10 border-white/10 border-b backdrop-blur-sm flex items-center px-8 text-white z-100'>
      <h1 className='text-2xl font-bold'><Link href={"/"} className='flex items-center gap-2'><Image src={"/images/logo.png"} alt='Logo' width={32} height={32} className='rounded-lg'></Image> <span>FlipCards</span></Link></h1>
      <button onClick={handleClick} className='ml-auto hover:bg-green-700 hover:border-green-700 border-2 border-white bg-transparent text-white font-bold py-2 px-4 rounded duration-500 transform'>Rules</button>
        {showRules && (
            <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/8 bg-white text-black p-8 rounded-lg shadow-lg max-w-lg w-full z-50 bg-[url("/images/rule.jpg")] bg-cover scale-75'>
                <h2 className='text-3xl font-bold mb-4 text-center'>Game Rules</h2>
                <ul className='list-disc list-inside text-lg space-y-2 px-10'>
                    <li>Two players take turns picking cards from the deck.</li>
                    <li>When a card is picked, it flips to reveal its number.</li>
                    <li>The revealed number is added to the player score.</li>
                    <li>Once a card is picked, it is removed from the screen.</li>
                    <li>The game continues until all cards are picked.</li>
                    <li>Player with the higher score at the end wins.</li>
                </ul>
            </div>
        )}

    </nav>
    // when user clicks on rules button a popup card should open at center of screen with the rules of the game.

  )
}

export default Navbar