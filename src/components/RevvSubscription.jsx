import React from 'react';
import styles from './RevvSubscription.module.css';

const RevvSubscription = () => {
  return (
    <div className={styles.revvSubscription}>
      <div className={styles.textContent}>
        <h1>What is Revv Subscription?</h1>
        <p>
          It’s a different way of owning a car, without any down payment or car loan. 
          Your monthly fee covers insurance, service & maintenance. Plus, there are 
          no long term commitments - you can return, extend or buy-out the car when 
          you want. And all this at a price cheaper than an EMI!
        </p>
      </div>
      <div className={styles.videoContent}>
        <iframe 
          width="100%" 
          height="100%" 
          src="public/carrental.mp4" 
          title="YouTube video player" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen>
        </iframe>
      </div>
    </div>
  );
};

export default RevvSubscription;
