import React from 'react';

const btnStyle = {
  fontSize: "24px",
  padding: "8px",
  marginRight: "10px",
  cursor: "pointer",
  borderRadius: "8px",
};

function Menu({ paused, handleRestart, togglePlayPause, active, handleActive }) {
  return (
    <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
      {active ? (
        <>
          <button onClick={handleRestart} style={btnStyle}>
            🔄
          </button>

          <button onClick={togglePlayPause} style={btnStyle}>
            {paused ? "▶" : "⏸"}
          </button>
        </>
      ) : (
        <button onClick={handleActive} style={btnStyle}>
          Enter
        </button>
      )}
    </div>
  );
}

export default Menu;
