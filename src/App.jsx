import React, { useState, useEffect } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [codigos, setCodigos] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  // Cargar el archivo JSON desde la carpeta public
  useEffect(() => {
    fetch('/Codigos.json')
      .then((response) => response.json())
      .then((data) => {
        setCodigos(data);
        setFilteredResults(data); // Inicialmente, muestra todos los resultados
      })
      .catch((error) => console.error('Error cargando el JSON:', error));
  }, []);

  // Filtrar los resultados en tiempo real
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = codigos.filter(codigo =>
        codigo.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]); // No mostrar resultados si no hay término de búsqueda
    }
  }, [searchTerm, codigos]);

  return (
    <div className="App">
      <h1>Filtro de Códigos de Enfermedades</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm.trim() && (
        <ul>
          {filteredResults.length > 0 ? (
            filteredResults.map(codigo => (
              <li key={codigo.id}>
                <strong>{codigo.code}</strong>
              </li>
            ))
          ) : (
            <li>No hay resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
