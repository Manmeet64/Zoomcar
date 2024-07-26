import React from 'react';
import styles from './ComparisonTable.module.css';

const ComparisonTable = () => {
  const features = [
    { name: "Basic booking features", freemium: true, premium: true },
    { name: "Annual insurance included", freemium: false, premium: true},
    { name: "Safe and Sanitized cars", freemium: false, premium: true },
    { name: "Free Delivery", freemium: false, premium: true },
    { name: "Monthly Rent", freemium: false, premium: true },
    { name: "Choose your own Driver", freemium: false, premium: true },
    { name: "50% extra as compared to normal booking drives", freemium: false, premium: true }
  ];

  return (
    <div className={styles.Container}>
    <div className={styles.tableContainer}>
      <h1 className={styles.highlight}>Compare <span className={styles.highlight}>Freemium</span> vs Premium</h1>
      <table className={styles.comparisonTable}>
        <thead>
          <tr className={styles.subscriptionHeader}>
            <th></th>
            <th className={styles.subscribeHeader}>Freemium</th>
            <th>Premium</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index}>
              <td>{feature.name}</td>
              <td className={styles.subscribeColumn}>
                {feature.freemium ? (
                  <i className={`fas fa-check ${styles.icon} ${styles.correct}`}></i>
                ) : (
                  <i className={`fas fa-times ${styles.icon} ${styles.wrong}`}></i>
                )}
              </td>
              <td className={styles.premiumColumn}>
                {feature.premium ? (
                  <i className={`fas fa-check ${styles.icon} ${styles.correct}`}></i>
                ) : (
                  <i className={`fas fa-times ${styles.icon} ${styles.wrong}`}></i>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button  className={styles.btn}>Subscribe</button>
    </div>
    </div>
  );
};

export default ComparisonTable;
