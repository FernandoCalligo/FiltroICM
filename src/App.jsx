import { useState, useEffect } from 'react';
import "./App.css"

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [codigos, setCodigos] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    fetch('/codigos_enfermedades.json')
      .then((response) => response.json())
      .then((data) => {
        setCodigos(data);
        setFilteredResults(data);
      })
      .catch((error) => console.error('Error cargando el JSON:', error));
  }, []);

  useEffect(() => {
    const additionalCodes = {
      O: ['Z392'], 
      P: [] 
    };

    let results = codigos;

    if (category) {
      results = results.filter(codigo => 
        codigo.code.startsWith(category) ||
        additionalCodes[category]?.includes(codigo.code)
      );
    }

    if (searchTerm.trim()) {
      results = results.filter(codigo =>
        codigo.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (showFavorites) {
      results = results.filter(codigo => codigo.favorito === true);
    }

    setFilteredResults(results);
  }, [searchTerm, category, showFavorites, codigos]);

  const handleCopy = (code) => {
    let  codigoParte = code.split(' ')[0];

    if (codigoParte.length > 1) {
      const penultima = codigoParte.slice(-2, -1);
      const ultima = codigoParte.slice(-1);
      codigoParte = codigoParte.slice(0, -2) + penultima + "." + ultima;
    }

    navigator.clipboard.writeText(codigoParte)
      .then(() => alert(`Código ${codigoParte} copiado al portapapeles`))
      .catch(err => console.error('Error al copiar al portapapeles:', err));
  };

  return (
    <div className="App">
      <div className='advertencia'>
        <span>Buscar código sin "."</span>
      </div>
      <h1>CÓDIGOS CIE-10</h1>
      <h2>SISTEMA DE GESTIÓN DE CAMAS</h2>
      <input
        className='inp'
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className='form'>
        <label>
          Categoría:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas</option>
            <option value="O">Obstetricia</option>
            <option value="P">Pediatría</option>
          </select>
        </label>
      </div>
      <div className='form'>
        <label>
          Mostrar Favoritos:
          <input
          className='check'
            type="checkbox"
            checked={showFavorites}
            onChange={(e) => setShowFavorites(e.target.checked)}
          />
        </label>
      </div>
      {searchTerm.trim() || category || showFavorites ? (
        <ul>
          {filteredResults.length > 0 ? (
            filteredResults.map(codigo => (
              <li key={codigo.id}>
                <p>
                  <strong>{codigo.code.slice(0, 3) + "." + codigo.code.slice(3, 4)}</strong>{codigo.code.slice(4)}
                  <button onClick={() => handleCopy(codigo.code)} style={{ marginLeft: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                  </svg>
                  </button>
                </p>
              </li>
            ))
          ) : (
            <li>No hay resultados</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}

export default App;
