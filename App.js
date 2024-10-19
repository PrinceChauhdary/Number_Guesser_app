import './App.css';
import React, { useState } from 'react';
import NumberInput from './Componets/NumberInput';

const generateRandomNumber = (max) => Math.floor(Math.random() * max) + 1;

function Binary_search(Random, Value) {
    if (Value > Random) {
        return "Your guess is too high!";
    } else if (Value < Random) {
        return "Your guess is too low!";
    } else {
        return "Congratulations, you guessed it right!";
    }
}

function App() {
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [guessCount, setGuessCount] = useState(0);
    const [highScore, setHighScore] = useState(
        localStorage.getItem('highScore') || Infinity
    );
    const [hint, setHint] = useState('');
    const [animationClass, setAnimationClass] = useState('');
    const [showCongrats, setShowCongrats] = useState(false);
    const [difficulty, setDifficulty] = useState('medium');
    const [randomNumber, setRandomNumber] = useState(generateRandomNumber(100));
    const [playerName, setPlayerName] = useState('');
    const [leaderboard, setLeaderboard] = useState(
        JSON.parse(localStorage.getItem('leaderboard')) || []
    );

    const handleDifficultyChange = (e) => {
        const newDifficulty = e.target.value;
        setDifficulty(newDifficulty);
        setRandomNumber(generateRandomNumber(newDifficulty === 'easy' ? 50 : newDifficulty === 'hard' ? 200 : 100));
        handleReplay();
    };

    const handleChange = (e) => {
        const intValue = parseInt(e.target.value, 10);
        const max = difficulty === 'easy' ? 50 : difficulty === 'hard' ? 200 : 100;
        if (isNaN(intValue)) {
            setError("Please enter a valid number");
            setValue('');
        } else if (intValue > max || intValue <= 0) {
            setError(`Value must be between 1 and ${max}`);
            setValue('');
        } else {
            setError('');
            setValue(intValue);
        }
    };

    const handleSubmit = () => {
        if (value === '') {
            setError("Please enter a valid number");
            return;
        }
        const result = Binary_search(randomNumber, value);
        setMessage(result);
        setGuessCount(guessCount + 1);
        setAnimationClass('shake');
        setTimeout(() => setAnimationClass(''), 1000);
        if (result.includes("Congratulations")) {
            setAnimationClass('winner');
            setShowCongrats(true);
            const newHighScore = Math.min(guessCount + 1, highScore);
            setHighScore(newHighScore);
            localStorage.setItem('highScore', newHighScore);
        } else if (guessCount >= 3) {
            setHint(`Hint: The number is ${randomNumber % 2 === 0 ? 'even' : 'odd'}`);
        }
    };

    const handleReplay = () => {
        setRandomNumber(generateRandomNumber(difficulty === 'easy' ? 50 : difficulty === 'hard' ? 200 : 100));
        setValue('');
        setMessage('');
        setError('');
        setGuessCount(0);
        setHint('');
        setAnimationClass('');
        setShowCongrats(false);
    };

    const handlePlayerNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const saveToLeaderboard = () => {
        const newLeaderboard = [...leaderboard, { name: playerName, score: guessCount }];
        newLeaderboard.sort((a, b) => a.score - b.score); // sort by score ascending
        setLeaderboard(newLeaderboard.slice(0, 5)); // keep top 5 scores
        localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard.slice(0, 5)));
        setPlayerName('');
        handleReplay();
    };

    return (
        <div className="App">
            <div className={`card ${animationClass}`}>
                <h1>Welcome to the World of Guessing Numbers</h1>
                <h2>Select Difficulty Level</h2>
                <select value={difficulty} onChange={handleDifficultyChange}>
                    <option value="easy">Easy (1-50)</option>
                    <option value="medium">Medium (1-100)</option>
                    <option value="hard">Hard (1-200)</option>
                </select>
                <h2>Please Enter Your Guess</h2>
                <NumberInput value={value} onChange={handleChange} />
                {error && <p className="error">{error}</p>}
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={handleReplay}>Replay</button>
                <h3>Your Guess: {value}</h3>
                <h3>{message}</h3>
                <h3>Guess Count: {guessCount}</h3>
                <h3>High Score: {highScore !== Infinity ? highScore : 'N/A'}</h3>
                {hint && <h3>{hint}</h3>}
            </div>
            {showCongrats && (
                <div className="congrats-card">
                    <h1>🎉 Congratulations! 🎉</h1>
                    <p>You guessed the correct number!</p>
                    <h3>Guess Count: {guessCount}</h3>
                    <h3>High Score: {highScore !== Infinity ? highScore : 'N/A'}</h3>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={handlePlayerNameChange}
                    />
                    <button onClick={saveToLeaderboard}>Save</button>
                    <button onClick={handleReplay}>Replay</button>
                </div>
            )}
            <div className="leaderboard">
                <h2>Leaderboard</h2>
                {leaderboard.length === 0 ? (
                    <p>No scores yet. Be the first!</p>
                ) : (
                    <ol>
                        {leaderboard.map((player, index) => (
                            <li key={index}>{player.name}: {player.score}</li>
                        ))}
                    </ol>
                )}
            </div>
        </div>
    );
}

export default App;
