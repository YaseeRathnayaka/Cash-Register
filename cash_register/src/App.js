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

const denominationValues = {
  'PENNY': 0.01,
  'NICKEL': 0.05,
  'DIME': 0.10,
  'QUARTER': 0.25,
  'ONE': 1.00,
  'FIVE': 5.00,
  'TEN': 10.00,
  'TWENTY': 20.00,
  'ONE HUNDRED': 100.00
};

function App() {
  const [cid, setCid] = useState(initialCid);
  const [price, setPrice] = useState('');
  const [cash, setCash] = useState('');
  const [changeDue, setChangeDue] = useState('');
  const [changeBreakdown, setChangeBreakdown] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [initialState, setInitialState] = useState(initialCid);
  const [givenCash, setGivenCash] = useState('');

  const calculateBillsAndCoins = (cid) => {
    return cid.map(item => {
      const [name, amount] = item;
      return [name, Math.floor(amount / denominationValues[name])];
    });
  };

  const initialBillsAndCoins = calculateBillsAndCoins(initialState);
  const updatedBillsAndCoins = calculateBillsAndCoins(cid);

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

    setTotalAmount(price);
    setGivenCash(cash);

    if (cashProvided === purchasePrice) {
      setChangeDue('No change due - customer paid with exact cash');
      setChangeBreakdown([]);
      setBalanceAmount(0);
      setCash('');
      return;
    }

    let changeDue = cashProvided - purchasePrice;
    setBalanceAmount(changeDue);
    let reversedCid = [...cid].reverse();
    let denominations = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
    let result = { status: 'OPEN', change: [] };
    let totalCID = parseFloat(
      cid.map((total) => total[1]).reduce((prev, curr) => prev + curr).toFixed(2)
    );

    if (totalCID < changeDue) {
      setChangeDue('Status: INSUFFICIENT_FUNDS');
      setChangeBreakdown([]);
      setBalanceAmount(0);
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
      setBalanceAmount(0);
      return;
    }

    setChangeDue(formatResults(result.status, result.change));
    setChangeBreakdown(changeArr);
    updateUI(result.change);
  };

  const updateUI = (change) => {
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
      <div className="header">
        <h1>Cash Register</h1>
      </div>
      <div className="container">
        <div className="section input-section">
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
        <div className="section result-section">
          <div id="total-amount">
            <p><strong>Total Amount:</strong> ${totalAmount}</p>
          </div>
          <div id="given-cash">
            <p><strong>Given Cash:</strong> ${givenCash}</p>
          </div>
          <div id="balance-amount">
            <p><strong>Balance Amount:</strong> ${balanceAmount}</p>
          </div>
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
        <div className="section" id="cash-drawer-display">
          <div className="cash-drawer-section">
            <p><strong>Initial Cash in Drawer:</strong></p>
            {initialBillsAndCoins.map((money) => (
              <p key={money[0]}>
                {money[0]}: {money[1]} pcs
              </p>
            ))}
          </div>
          <div className="cash-drawer-section">
            <p><strong>Cash in Drawer After Purchase:</strong></p>
            {updatedBillsAndCoins.map((money) => (
              <p key={money[0]}>
                {money[0]}: {money[1]} pcs
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
