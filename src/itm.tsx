import React, { useState } from "react";
import './style.css';

const ITM = () => {
  const createRow = () => ({
    debut: "",
    fin: "",
    jours: "",
    enfants: 0, // Added a new field for children
    pourcentage: "",
    contribution: "", // Added a new field for contribution
    total: "",
  });

  const handleKeyDown = (index, e) => {
    if (e.key === 'Tab' && index === rows.length - 1) {
      e.preventDefault(); // Empêche le comportement par défaut de la touche Tab
      addRow(); // Ajoute une nouvelle ligne
    }
  };

  const [rows, setRows] = useState([createRow()]);
  const [category, setCategory] = useState("Incapacité Temporaire Ménagère");

  const calculateRow = (row) => {
    const { debut, fin, indemnite, enfants, pourcentage, contribution } = row;
    let jours = "";
    let total = "";

    // Calculate indemnité journalière based on children
    const indemniteJournaliere = 30 + 10 * enfants;

    if (debut && fin) {
      const debutDate = new Date(debut);
      const finDate = new Date(fin);
      if (!isNaN(debutDate) && !isNaN(finDate)) {
        jours = Math.max(0, (finDate - debutDate) / (1000 * 60 * 60 * 24));
        // Calculate total based on the formula
        total = (jours * indemniteJournaliere * (pourcentage / 100) * (contribution / 100)).toFixed(2);
      }
    }
    return { jours, total, indemniteJournaliere };
  };

  const addRow = () => {
    let newRow = createRow();
  
    // Récupérer les valeurs des colonnes "Enfant(s)" et "Contribution (%)" de la première ligne
    if (rows.length > 0) {
      const firstRow = rows[0];
      newRow.enfants = firstRow.enfants;
      newRow.contribution = firstRow.contribution;
    }
  
    // Si une ligne existe déjà, définir la date de début de la nouvelle ligne comme le jour suivant la fin de la dernière ligne
    if (rows.length > 0) {
      const lastRowFin = rows[rows.length - 1].fin;
      if (lastRowFin) {
        const finDate = new Date(lastRowFin);
        if (!isNaN(finDate)) {
          finDate.setDate(finDate.getDate() + 1);
          newRow.debut = finDate.toISOString().split('T')[0];
        }
      }
    }
  
    setRows([...rows, newRow]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    const { jours, total, indemniteJournaliere } = calculateRow(updatedRows[index]);
    updatedRows[index].jours = jours;
    updatedRows[index].indemnite = indemniteJournaliere;
    updatedRows[index].total = total;
    setRows(updatedRows);
  };

  const getTotalSum = () => {
    return rows.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0).toFixed(2);
  };

  const resetData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les données ?')) {
      setRows([createRow()]); // Réinitialiser les lignes à une seule ligne vide
    }
  };

  return (
    <div className="app">
      <div id="menu">
        {/* Your category buttons here */}
      </div>

      <div id="content">
        <div id="top-menu">
          <button onClick={() => { /* saveData logic */ }}>Sauvegarder</button>
          <input type="file" id="loadFileInput" style={{ display: 'none' }} onChange={() => { /* loadData logic */ }} />
          <button onClick={() => document.getElementById('loadFileInput').click()}>Charger</button>
          <button onClick={resetData}>Réinitialiser</button>
        </div>

        <h1>{category}</h1>

        <table id="itTable">
          <thead>
            <tr>
              <th>Début</th>
              <th>Fin</th>
              <th>Jours</th>
              <th>Indemnité journalière (€)</th>
              <th>Enfant(s)</th> {/* New column for children */}
              <th>%</th>
              <th>Contribution (%)</th> {/* New column for contribution */}
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type="date" value={row.debut} onChange={(e) => handleInputChange(index, 'debut', e.target.value)} /></td>
                <td><input type="date" value={row.fin} onChange={(e) => handleInputChange(index, 'fin', e.target.value)} /></td>
                <td><input type="number" value={row.jours} readOnly /></td>
                <td><input type="number" value={row.indemnite} step="0.01" readOnly /></td>
                <td><input type="number" value={row.enfants} onChange={(e) => handleInputChange(index, 'enfants', parseInt(e.target.value) || 0)} /></td>
                <td><input type="number" value={row.pourcentage} step="0.01" onChange={(e) => handleInputChange(index, 'pourcentage', parseFloat(e.target.value))} /></td>
                <td><input type="number" value={row.contribution} step="0.01" onChange={(e) => handleInputChange(index, 'contribution', parseFloat(e.target.value))} /></td>
                <td><input type="number" value={row.total} readOnly onKeyDown={(e) => handleKeyDown(index, e)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>+</button>

        <div className="total-box">
          <strong>Total : </strong> {getTotalSum()} €
        </div>
      </div>
    </div>
  );
};

export default ITM;