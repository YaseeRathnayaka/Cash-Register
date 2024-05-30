import React, { useState } from 'react';
import './App.css';

const initialCid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100],
];

function App() {
  const [cid, setCid] = useState(initialCid);
  const [price, setPrice] = useState('');
  const [cash, setCash] = useState('');
  const [changeDue, setChangeDue] = useState('');
  const [changeBreakdown, setChangeBreakdown] = useState([]);

  const formatResults = (status, change) => {
    return (
      <>
        <p>Status: {status}</p>
        {change.map((money) => (
          <p key={money[0]}>
            {money[0]}: ${money[1]}
          </p>
        ))}
      </>
    );
  };

  const checkCashRegister = () => {
    const purchasePrice = parseFloat(price);
    const cashProvided = parseFloat(cash);

    if (cashProvided < purchasePrice) {
      alert('Customer does not have enough money to purchase the item');
      setCash('');
      return;
    }

    if (cashProvided === purchasePrice) {
      setChangeDue('No change due - customer paid with exact cash');
      setChangeBreakdown([]);
      setCash('');
      return;
    }

    let changeDue = cashProvided - purchasePrice;
    let reversedCid = [...cid].reverse();
    let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
    let result = { status: 'OPEN', change: [] };
    let totalCID = parseFloat(
      cid.map((total) => total[1]).reduce((prev, curr) => prev + curr).toFixed(2)
    );

    if (totalCID < changeDue) {
      setChangeDue('Status: INSUFFICIENT_FUNDS');
      setChangeBreakdown([]);
      return;
    }

    if (totalCID === changeDue) {
      result.status = 'CLOSED';
    }

    let changeArr = [];

    for (let i = 0; i < reversedCid.length; i++) {
      if (changeDue >= denominations[i] && changeDue > 0) {
        let count = 0;
        let total = reversedCid[i][1];
        while (total > 0 && changeDue >= denominations[i]) {
          total -= denominations[i];
          changeDue = parseFloat((changeDue - denominations[i]).toFixed(2));
          count++;
        }
        if (count > 0) {
          result.change.push([reversedCid[i][0], count * denominations[i]]);
          changeArr.push([reversedCid[i][0], count]);
        }
      }
    }

    if (changeDue > 0) {
      setChangeDue('Status: INSUFFICIENT_FUNDS');
      setChangeBreakdown([]);
      return;
    }

    setChangeDue(formatResults(result.status, result.change));
    setChangeBreakdown(changeArr);
    updateUI(result.change);
  };

  const updateUI = (change) => {
    const currencyNameMap = {
      PENNY: 'Pennies',
      NICKEL: 'Nickels',
      DIME: 'Dimes',
      QUARTER: 'Quarters',
      ONE: 'Ones',
      FIVE: 'Fives',
      TEN: 'Tens',
      TWENTY: 'Twenties',
      'ONE HUNDRED': 'Hundreds',
    };

    if (change) {
      change.forEach((changeArr) => {
        const targetArr = cid.find((cidArr) => cidArr[0] === changeArr[0]);
        targetArr[1] = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
      });
      setCid([...cid]);
    }

    setCash('');
  };

  const handlePurchase = () => {
    if (!price || !cash) return;
    checkCashRegister();
  };

  return (
    <div className="app">
      <div className="input-section">
        <label htmlFor="price">Price of Item:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price of the item"
        />
        <label htmlFor="cash">Cash Provided:</label>
        <input
          type="number"
          id="cash"
          value={cash}
          onChange={(e) => setCash(e.target.value)}
          placeholder="Enter cash provided"
        />
        <button onClick={handlePurchase}>Purchase</button>
      </div>
      <div className="result-section">
        <div id="change-due" dangerouslySetInnerHTML={{ __html: changeDue }}></div>
        <div className="change-breakdown">
          <p><strong>Change Breakdown:</strong></p>
          {changeBreakdown.map((item) => (
            <p key={item[0]}>
              {item[0]}: {item[1]}
            </p>
          ))}
        </div>
      </div>
      <div id="cash-drawer-display">
        <p><strong>Change in drawer:</strong></p>
        {cid.map((money) => (
          <p key={money[0]}>
            {money[0]}: ${money[1]}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
