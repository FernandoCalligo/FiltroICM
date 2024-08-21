import { useState, useEffect } from 'react';
import "./App.css"

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
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

    setFilteredResults(results);
  }, [searchTerm, category, codigos])

  useEffect(() => {
    console.log('Codigos:', codigos);
    console.log('Category:', category);
    console.log('SearchTerm:', searchTerm);
  
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
  
    console.log('Filtered Results:', results);
    setFilteredResults(results);
  }, [searchTerm, category, codigos]);

  return (
    <div className="App">
      <div className='advertencia'>
          <span>Buscar código sin "."</span>
      </div>
      <h1>CÓDIGOS CIE-10</h1>
      <h2>SISTEMA DE GESTIÓN DE CAMAS</h2>
      <input
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
      {searchTerm.trim() || category ? (
        <ul>
          {filteredResults.length > 0 ? (
            filteredResults.map(codigo => (
              <li key={codigo.id}>
                <p><strong>{codigo.code.slice(0,3)+"."+codigo.code.slice(3,4)}</strong>{codigo.code.slice(4)}</p>
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
