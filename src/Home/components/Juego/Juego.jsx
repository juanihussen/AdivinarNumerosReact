import React, { useState, useCallback, useEffect } from 'react';
import './Styles.css';

const Juego = () => {

  const [numero, setNumero] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [intentos, setIntentos] = useState(0);
  const [puntaje, setPuntaje] = useState(5);
  const [numeroSecreto, setNumeroSecreto] = useState(Math.floor(Math.random() * 10) + 1);

  const [highScores, setHighScores] = useState(() => {
    const savedScores = localStorage.getItem('highScores');
    return savedScores ? JSON.parse(savedScores) : [];
  });
  const [mensajeClase, setMensajeClase] = useState("");
  const [fondoClase, setFondoClase] = useState("");

  const manejarCambio = (e) => {
    setNumero(e.target.value);
  };

  const manejarEnvio = () => {
    const num = parseInt(numero, 10);
    if (puntaje <= 0) {
      setMensaje('¡Perdiste! El número secreto era ${numeroSecreto}.');
      setMensajeClase('mensaje-perdida');
      setFondoClase('fondo-rojo');
      return;
    }

    setIntentos(intentos + 1);

    if (num === numeroSecreto) {
      setMensaje(`¡Felicidades! Adivinaste el número. Puntaje final: ${puntaje}`);
      setMensajeClase('mensaje-victoria');
      setFondoClase('fondo-verde');

      const nuevoHighScore = { intentos, puntaje };
      setHighScores(prevScores => {
        const nuevosScores = [...prevScores, nuevoHighScore]
          .sort((a, b) => a.intentos - b.intentos)
          .slice(0, 5);
        localStorage.setItem('highScores', JSON.stringify(nuevosScores));

        return nuevosScores;
      });
    } else {
      setPuntaje(puntaje - 1);
      if (puntaje <= 1) {
        setMensaje(`¡Perdiste! El número secreto era ${numeroSecreto}.`);
        setMensajeClase('mensaje-perdida');
        setFondoClase('fondo-rojo');
      } else {
        setMensajeClase('');
        setFondoClase('');
        if (num < numeroSecreto) {
          setMensaje("El número es mayor.");
        } else {
          setMensaje("El número es menor.");
        }
      }
    }
  };

  const reiniciarJuego = useCallback(() => {
    setNumero("");
    setMensaje("");
    setIntentos(0);
    setPuntaje(5);
    setNumeroSecreto(Math.floor(Math.random() * 10) + 1);
    setMensajeClase('');
    setFondoClase('');
  }, []);

  useEffect(() => {
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }, [highScores]);

  const mostrarHighScores = mensaje.includes('Felicidades') || mensaje.includes('Perdiste');

  return (
    <div className={`contenedorJuego ${fondoClase}`}>
      <h1 id='titulo'>Adivina el numero.Si puedes...</h1>

      <div className='inputIntentosContainer'>
      <input value={numero} onChange={manejarCambio} />
      <p className={mensajeClase}>{mensaje}</p>
      <p> Intentos : {intentos} / 5</p>
      </div>

      
      <div className='contenedorBotones'>
        <button onClick={manejarEnvio} disabled={puntaje <= 0}>Adivinar</button>
        <button onClick={reiniciarJuego}>Reiniciar</button>
      </div>
    
      {mostrarHighScores && (
    <div className="podioContainer">
      <p id="podio">Puntaje mas alto</p>
      <ul>
        {highScores
          .sort((a, b) => a.intentos - b.intentos)
          .slice(0, 1)
          .map((score, index) => (
            <li key={index}>
              #{index + 1} Puntaje: {score.puntaje}
            </li>
          ))}
      </ul>
    </div>
)}

    </div>
  );
};

export default Juego;












